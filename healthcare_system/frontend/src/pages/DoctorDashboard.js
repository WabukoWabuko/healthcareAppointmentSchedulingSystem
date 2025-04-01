import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';

function DoctorDashboard() {
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
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    if (location.pathname === '/doctor-dashboard/appointments') {
      fetchAppointments();
    }
  }, [location, token]);

  return (
    <div>
      <h3>Doctor Dashboard</h3>
      <nav>
        <Link to="/doctor-dashboard/appointments">Appointments</Link>
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
      </Routes>
    </div>
  );
}

export default DoctorDashboard;
