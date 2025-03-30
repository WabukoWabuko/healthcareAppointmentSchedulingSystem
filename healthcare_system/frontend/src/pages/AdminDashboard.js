import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('http://127.0.0.1:8000/api/patients/', config).then(res => setPatients(res.data));
    axios.get('http://127.0.0.1:8000/api/doctors/', config).then(res => setDoctors(res.data));
    axios.get('http://127.0.0.1:8000/api/appointments/', config).then(res => setAppointments(res.data));
  }, [token]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Patients</h3>
      <ul>{patients.map(p => (<li key={p.id}>{p.name} - {p.email}</li>))}</ul>
      <h3>Doctors</h3>
      <ul>{doctors.map(d => (<li key={d.id}>{d.name} - {d.specialization}</li>))}</ul>
      <h3>All Appointments</h3>
      <ul>{appointments.map(a => (<li key={a.id}>{a.datetime} - {patients.find(p => p.id === a.patient)?.name} with {doctors.find(d => d.id === a.doctor)?.name} - {a.status}</li>))}</ul>
    </div>
  );
}
export default AdminDashboard;
