import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Row, Col, Card } from 'react-bootstrap'; // Removed Routes from here
import { Routes, Route } from 'react-router-dom'; // Added correct import
import AppointmentCard from '../components/AppointmentCard';

function DoctorDashboard() {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [doctorId, setDoctorId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [apptRes, doctorRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/appointments/', config),
        axios.get('http://127.0.0.1:8000/api/doctors/', config),
      ]);
      const doctorId = doctorRes.data[0].id;
      const availRes = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`, config);
      setAppointments(apptRes.data.map(appt => ({
        ...appt,
        patient_name: appt.patient_name || 'Unknown', // Adjust if backend provides this
      })));
      setAvailability(availRes.data);
      setDoctorId(doctorId);
    };
    if (token) fetchData();
  }, [token]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.post(
      `http://127.0.0.1:8000/api/doctors/${doctorId}/availability/`,
      { start_time: startTime, end_time: endTime },
      config
    );
    setAvailability([...availability, res.data]);
    setStartTime('');
    setEndTime('');
  };

  const handleCancel = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, config);
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <Routes>
      <Route
        path="/appointments"
        element={
          <div>
            <h3>Your Appointments</h3>
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
        }
      />
      <Route
        path="/availability"
        element={
          <div>
            <h3>Manage Availability</h3>
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
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">Add</Button>
                </Form>
              </Col>
            </Row>
            <h4 className="mt-4">Your Availability</h4>
            <Row>
              {availability.map(a => (
                <Col md={4} key={a.id}>
                  <Card className="mb-3">
                    <Card.Body>{a.start_time} - {a.end_time}</Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        }
      />
    </Routes>
  );
}

export default DoctorDashboard;
