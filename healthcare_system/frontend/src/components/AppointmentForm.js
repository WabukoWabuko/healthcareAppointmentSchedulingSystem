import { useState, useEffect } from 'react';
import axios from 'axios';

function AppointmentForm() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [datetime, setDatetime] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch patients
    axios.get('http://127.0.0.1:8000/api/patients/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setPatients(res.data));

    // Fetch doctors
    axios.get('http://127.0.0.1:8000/api/doctors/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDoctors(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/appointments/',
        { patient: patientId, doctor: doctorId, datetime, status: 'pending' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Appointment booked!');
    } catch (error) {
      alert('Error: ' + error.response.data.detail);
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
          <option value="">Select Doctor</option>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
export default AppointmentForm;
