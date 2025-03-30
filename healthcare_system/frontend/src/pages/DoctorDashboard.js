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
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        // Fetch appointments
        const apptRes = await axios.get('http://127.0.0.1:8000/api/appointments/', config);
        setAppointments(apptRes.data);

        // Fetch doctor's ID and availability
        const doctorRes = await axios.get('http://127.0.0.1:8000/api/doctors/', config);
        const doctorId = doctorRes.data[0].id; // Assuming the logged-in doctor is the first match
        const availRes = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`, config);
        setAvailability(availRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const doctorRes = await axios.get('http://127.0.0.1:8000/api/doctors/', config);
      const doctorId = doctorRes.data[0].id;
      const res = await axios.post(
        `http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`,
        { start_time: startTime, end_time: endTime },
        config
      );
      setAvailability([...availability, res.data]);
      alert('Availability added!');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      alert('Error adding availability: ' + error.response.data.detail);
    }
  };

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <h3>Add Availability</h3>
      <form onSubmit={handleAddAvailability}>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <h3>Your Availability</h3>
      <ul>
        {availability.map(a => (
          <li key={a.id}>{a.start_time} - {a.end_time}</li>
        ))}
      </ul>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map(a => (
          <li key={a.id}>{a.datetime} with Patient - {a.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorDashboard;
