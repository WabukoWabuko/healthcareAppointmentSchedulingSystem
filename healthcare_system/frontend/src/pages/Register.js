import { useState } from 'react';
import api from '../api';  // Use the new Axios instance
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/users/', {
        email,
        username,
        password,
        role,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Failed to register: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div>
      <h3>Register</h3>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Row>
        <Col md={6}>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">Register</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
