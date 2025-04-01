import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import api from '../api';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const apptRes = await api.get('/api/appointments/');
        setAppointments(apptRes.data);

        // Fetch availabilities
        const availRes = await api.get('/api/doctors/availabilities/');
        setAvailabilities(availRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    try {
      const doctorRes = await api.get('/api/doctors/doctors/');
      const doctor = doctorRes.data[0]; // Assuming the doctor is the first one (simplified)

      await api.post('/api/doctors/availabilities/', {
        doctor: doctor.id,
        start_time: startTime,
        end_time: endTime,
      });
      alert('Availability added successfully!');
      const availRes = await api.get('/api/doctors/availabilities/');
      setAvailabilities(availRes.data);
    } catch (error) {
      console.error('Error adding availability:', error);
      alert('Failed to add availability.');
    }
  };

  return (
    <Container className="mt-4">
      <h3>Doctor Dashboard - Appointments</h3>
      <h4>Your Appointments</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date & Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.patient.name}</td>
              <td>{new Date(appt.datetime).toLocaleString()}</td>
              <td>{appt.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4>Add Availability</h4>
      <Form onSubmit={handleAddAvailability}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Add Availability</Button>
      </Form>

      <h4>Your Availability</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map((avail) => (
            <tr key={avail.id}>
              <td>{new Date(avail.start_time).toLocaleString()}</td>
              <td>{new Date(avail.end_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default DoctorDashboard;
