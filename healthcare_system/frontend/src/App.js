import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Healthcare System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  {user.role === 'patient' && (
                    <>
                      <Nav.Link as={Link} to="/dashboard/book">Book Appointment</Nav.Link>
                      <Nav.Link as={Link} to="/dashboard/appointments">Appointments</Nav.Link>
                    </>
                  )}
                  {user.role === 'doctor' && (
                    <>
                      <Nav.Link as={Link} to="/dashboard/appointments">Appointments</Nav.Link>
                      <Nav.Link as={Link} to="/dashboard/availability">Manage Availability</Nav.Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Nav.Link as={Link} to="/dashboard/patients">Patients</Nav.Link>
                      <Nav.Link as={Link} to="/dashboard/doctors">Doctors</Nav.Link>
                      <Nav.Link as={Link} to="/dashboard/appointments">Appointments</Nav.Link>
                    </>
                  )}
                </>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
            {user && (
              <Button variant="outline-light" onClick={logout}>Logout</Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Routes */}
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Nested Routes for Dashboards */}
            {user && user.role === 'patient' && (
              <>
                <Route path="appointments" element={<PatientDashboard />} />
                <Route path="book" element={<PatientDashboard />} />
                <Route path="" element={<Navigate to="appointments" />} />
              </>
            )}
            {user && user.role === 'doctor' && (
              <>
                <Route path="appointments" element={<DoctorDashboard />} />
                <Route path="availability" element={<DoctorDashboard />} />
                <Route path="" element={<Navigate to="appointments" />} />
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <Route path="patients" element={<AdminDashboard />} />
                <Route path="patients/new" element={<AdminDashboard />} />
                <Route path="doctors" element={<AdminDashboard />} />
                <Route path="doctors/new" element={<AdminDashboard />} />
                <Route path="appointments" element={<AdminDashboard />} />
                <Route path="" element={<Navigate to="patients" />} />
              </>
            )}
          </Route>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
