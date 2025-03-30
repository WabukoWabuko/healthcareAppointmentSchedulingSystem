import { Navbar as BSNavbar, Nav, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <BSNavbar.Brand href="#home">Healthcare Scheduler</BSNavbar.Brand>
      <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BSNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {user ? (
            <>
              <Nav.Link disabled>Welcome, {user.email} ({user.role})</Nav.Link>
              <Button variant="outline-light" onClick={() => { logout(); navigate('/'); }}>
                Logout
              </Button>
            </>
          ) : (
            <Nav.Link href="/">Login</Nav.Link>
          )}
        </Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  );
}
export default Navbar;
