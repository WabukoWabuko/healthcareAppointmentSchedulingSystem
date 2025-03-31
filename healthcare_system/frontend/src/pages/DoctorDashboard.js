import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

function DoctorDashboard() {
  const { token, user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user) {
        console.log('No token or user available:', { token, user });
        setErrorMessage('Please log in to view your dashboard.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        console.log('Fetching data for doctor dashboard...');
        const [apptRes, doctorRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/appointments/', config),
          axios.get('http://127.0.0.1:8000/api/doctors/', config),
        ]);
        const doctor = doctorRes.data.find(d => d.user === user.id);
        const doctorId = doctor?.id;
        if (!doctorId) {
          console.error('No doctor ID found for the logged-in user:', user.email);
          setErrorMessage('No doctor profile found for this user.');
          setLoading(false);
          return;
        }
        const availRes = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`, config);
        console.log('User:', user);
        console.log('Doctor ID:', doctorId);
        console.log('Appointments Response:', apptRes.data);
        console.log('Availability Response:', availRes.data);
        setAppointments(apptRes.data.map(appt => ({
          ...appt,
          patient_name: appt.patient_name || 'Unknown',
        })));
        setAvailability(availRes.data);
        setDoctorId(doctorId);
      } catch (error) {
        console.error('Error fetching doctor data:', error.response?.data || error.message);
        setErrorMessage('Failed to load data: ' + (error.response?.data?.detail || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`,
        { start_time: startTime, end_time: endTime },
        config
      );
      setAvailability([...availability, res.data]);
      setStartTime('');
      setEndTime('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding availability:', error);
      setErrorMessage('Failed to add availability: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleCancel = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, config);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setErrorMessage('Failed to cancel appointment: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : location.pathname.includes('/availability') ? (
        <div>
          <h3>Manage Availability</h3>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <Row>
            <Col md={6}>
              <h4>Add Availability</h4>
              <Form onSubmit={handleAddAvailability}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Add</Button>
              </Form>
            </Col>
          </Row>
          <h4 className="mt-4">Your Availability</h4>
          <Row>
            {availability.length ? (
              availability.map(a => (
                <Col md={4} key={a.id}>
                  <Card className="mb-3">
                    <Card.Body>{a.start_time} - {a.end_time}</Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No availability slots found.</p>
            )}
          </Row>
        </div>
      ) : (
        <div>
          <h3>Your Appointments</h3>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <Row>
            {appointments.length ? (
              appointments.map(a => (
                <Col md={4} key={a.id}>
                  <AppointmentCard appointment={a} onCancel={handleCancel} />
                </Col>
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </Row>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
