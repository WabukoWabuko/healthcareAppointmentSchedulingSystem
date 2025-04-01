import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';
import BookAppointment from './BookAppointment';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/appointments/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log('Patient appointments:', res.data); // Debug log
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    if (user && token && location.pathname === '/dashboard/appointments') {
      fetchAppointments();
    }
  }, [location, user, token]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Welcome, {user.username} (Patient)</h3>
      <nav>
        <Link to="/dashboard/appointments">Appointments</Link> |{' '}
        <Link to="/dashboard/book">Book Appointment</Link>
      </nav>
      <Routes>
        <Route
          path="appointments"
          element={
            <div>
              <h4>Your Appointments</h4>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))
              ) : (
                <p>No appointments found.</p>
              )}
            </div>
          }
        />
        <Route path="book" element={<BookAppointment />} />
      </Routes>
    </div>
  );
}

export default PatientDashboard;
