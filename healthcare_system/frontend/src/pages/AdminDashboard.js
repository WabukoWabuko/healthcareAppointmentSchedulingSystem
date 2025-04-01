import { useState, useEffect, useContext } from 'reactV2 from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Table } from 'react-bootstrap';

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/patients/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log('Patients:', res.data); // Debug log
        setPatients(res.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/doctors/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log('Doctors:', res.data); // Debug log
        setDoctors(res.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    if (user && token) {
      if (location.pathname === '/admin-dashboard/patients') {
        fetchPatients();
      } else if (location.pathname === '/admin-dashboard/doctors') {
        fetchDoctors();
      }
    }
  }, [location, user, token]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Welcome, {user.username} (Admin)</h3>
      <nav>
        <Link to="/admin-dashboard/patients">Patients</Link> |{' '}
        <Link to="/admin-dashboard/doctors">Doctors</Link>
      </nav>
      <Routes>
        <Route
          path="patients"
          element={
            <div>
              <h4>Patients</h4>
              {patients.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Insurance ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.insurance_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No patients found.</p>
              )}
            </div>
          }
        />
        <Route
          path="doctors"
          element={
            <div>
              <h4>Doctors</h4>
              {doctors.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No doctors found.</p>
              )}
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
