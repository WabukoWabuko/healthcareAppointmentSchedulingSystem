import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState('patient');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    if (password !== rePassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/users/', {
        email,
        username,
        password,
        re_password: rePassword,
        role,
      }, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      console.log('Response data:', error.response?.data);
      // Handle specific validation errors
      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.email) {
          setErrorMessage('Email error: ' + errors.email.join(' '));
        } else if (errors.username) {
          setErrorMessage('Username error: ' + errors.username.join(' '));
        } else if (errors.password) {
          setErrorMessage('Password error: ' + errors.password.join(' '));
        } else if (errors.re_password) {
          setErrorMessage('Confirm Password error: ' + errors.re_password.join(' '));
        } else if (errors.non_field_errors) {
          setErrorMessage(errors.non_field_errors.join(' '));
        } else {
          setErrorMessage('Failed to register: ' + JSON.stringify(errors));
        }
      } else {
        setErrorMessage('Failed to register: Unknown error');
      }
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
                minLength={8}
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters long.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
                minLength={8}
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
