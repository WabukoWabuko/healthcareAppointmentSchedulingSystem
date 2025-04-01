import React, { useContext } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function CustomNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">Healthcare System</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {user ? (
            <>
              {user.role === 'patient' && (
                <Nav.Link as={Link} to="/dashboard/appointments">Dashboard</Nav.Link>
              )}
              {user.role === 'doctor' && (
                <Nav.Link as={Link} to="/doctor-dashboard/appointments">Dashboard</Nav.Link>
              )}
              {user.role === 'admin' && (
                <Nav.Link as={Link} to="/admin-dashboard/patients">Admin Dashboard</Nav.Link>
              )}
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          )}
        </Nav>
        {user && (
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <span className="text-white me-2">Welcome, {user.username}</span>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
