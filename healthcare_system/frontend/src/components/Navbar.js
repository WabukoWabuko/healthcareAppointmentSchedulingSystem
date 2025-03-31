import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Healthcare System</Link>
      {token && user && (
        <>
          <div className="navbar-links">
            {user.role === 'patient' && (
              <>
                <Link to="/dashboard/appointments">Appointments</Link>
                <Link to="/dashboard/book">Book Appointment</Link>
              </>
            )}
            {user.role === 'doctor' && (
              <>
                <Link to="/doctor-dashboard/appointments">Appointments</Link>
                <Link to="/doctor-dashboard/availability">Availability</Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin-dashboard/patients">Patients</Link>
                <Link to="/admin-dashboard/doctors">Doctors</Link>
                <Link to="/admin-dashboard/appointments">Appointments</Link>
              </>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
