import { Nav } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <Nav className="flex-column bg-light p-3" style={{ height: '100vh', width: '250px' }}>
      <Nav.Link href="/dashboard" className="text-primary fw-bold">Dashboard</Nav.Link>
      {user.role === 'patient' && (
        <>
          <Nav.Link href="/dashboard/book">Book Appointment</Nav.Link>
          <Nav.Link href="/dashboard/appointments">My Appointments</Nav.Link>
        </>
      )}
      {user.role === 'doctor' && (
        <>
          <Nav.Link href="/dashboard/availability">Manage Availability</Nav.Link>
          <Nav.Link href="/dashboard/appointments">My Appointments</Nav.Link>
        </>
      )}
      {user.role === 'admin' && (
        <>
          <Nav.Link href="/dashboard/patients">Patients</Nav.Link>
          <Nav.Link href="/dashboard/doctors">Doctors</Nav.Link>
          <Nav.Link href="/dashboard/appointments">Appointments</Nav.Link>
        </>
      )}
    </Nav>
  );
}
export default Sidebar;
