import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Row, Col } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // Redirect based on user role
      if (user.role === 'patient') {
        navigate('/dashboard/appointments');
      } else if (user.role === 'doctor') {
        navigate('/doctor-dashboard/appointments');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard/patients');
      }
    } catch (error) {
      setErrorMessage('Failed to login: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div>
      <h3>Login</h3>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Row>
        <Col md={6}>
          <Form onSubmit={handleLogin}>
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
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
          </Form>
          <p className="mt-3">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
