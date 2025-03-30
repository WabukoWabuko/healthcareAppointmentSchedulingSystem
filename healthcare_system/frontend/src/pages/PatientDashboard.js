import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function PatientDashboard() {
  const { user, token } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [datetime, setDatetime] = useState('');

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('http://127.0.0.1:8000/api/doctors/', config).then(res => setDoctors(res.data));
    axios.get('http://127.0.0.1:8000/api/appointments/', config).then(res => setAppointments(res.data));
  }, [token]);

  const handleBook = async (e) => {
    e.preventDefault();
    const patientId = (await axios.get('http://127.0.0.1:8000/api/patients/', { headers: { Authorization: `Bearer ${token}` } })).data[0].id;
    await axios.post('http://127.0.0.1:8000/api/appointments/', { patient: patientId, doctor: doctorId, datetime, status: 'pending' }, { headers: { Authorization: `Bearer ${token}` } });
    setAppointments([...appointments, { patient: patientId, doctor: doctorId, datetime, status: 'pending' }]);
    alert('Appointment booked!');
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <h3>Book an Appointment</h3>
      <form onSubmit={handleBook}>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
          <option value="">Select Doctor</option>
          {doctors.map(d => (<option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>))}
        </select>
        <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
        <button type="submit">Book</button>
      </form>
      <h3>Your Appointments</h3>
      <ul>{appointments.map(a => (<li key={a.id}>{a.datetime} with Dr. {doctors.find(d => d.id === a.doctor)?.name} - {a.status}</li>))}</ul>
    </div>
  );
}
export default PatientDashboard;
