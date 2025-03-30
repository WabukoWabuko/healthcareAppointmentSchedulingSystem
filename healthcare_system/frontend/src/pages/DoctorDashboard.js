import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function DoctorDashboard() {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('http://127.0.0.1:8000/api/appointments/', config).then(res => setAppointments(res.data));
    const doctorId = (await axios.get('http://127.0.0.1:8000/api/doctors/', config)).data[0].id;
    axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`, config).then(res => setAvailability(res.data));
  }, [token]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const doctorId = (await axios.get('http://127.0.0.1:8000/api/doctors/', { headers: { Authorization: `Bearer ${token}` } })).data[0].id;
    await axios.post(`http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`, { start_time: startTime, end_time: endTime }, { headers: { Authorization: `Bearer ${token}` } });
    setAvailability([...availability, { start_time: startTime, end_time: endTime }]);
    alert('Availability added!');
  };

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <h3>Add Availability</h3>
      <form onSubmit={handleAddAvailability}>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <h3>Your Availability</h3>
      <ul>{availability.map(a => (<li key={a.id}>{a.start_time} - {a.end_time}</li>))}</ul>
      <h3>Your Appointments</h3>
      <ul>{appointments.map(a => (<li key={a.id}>{a.datetime} with Patient - {a.status}</li>))}</ul>
    </div>
  );
}
export default DoctorDashboard;
