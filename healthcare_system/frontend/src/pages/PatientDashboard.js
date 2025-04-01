import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import api from '../api';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const apptRes = await api.get('/api/appointments/');
        setAppointments(apptRes.data);

        // Fetch doctors
        const docRes = await api.get('/api/doctors/doctors/');
        setDoctors(docRes.data);

        // Fetch availabilities
        const availRes = await api.get('/api/doctors/availabilities/');
        setAvailabilities(availRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const patientRes = await api.get('/api/patients/');
      const patient = patientRes.data[0]; // Assuming the patient is the first one (simplified)

      await api.post('/api/appointments/', {
        patient: patient.id,
        doctor: selectedDoctor,
        datetime: selectedTime,
        status: 'pending',
      });
      alert('Appointment booked successfully!');
      const apptRes = await api.get('/api/appointments/');
      setAppointments(apptRes.data);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment.');
    }
  };

  return (
    <Container className="mt-4">
      <h3>Patient Dashboard - Appointments</h3>
      <h4>Your Appointments</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.doctor.name}</td>
              <td>{new Date(appt.datetime).toLocaleString()}</td>
              <td>{appt.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4>Book a New Appointment</h4>
      <Form onSubmit={handleBookAppointment}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Time</Form.Label>
              <Form.Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="">Select a time</option>
                {availabilities
                  .filter((avail) => avail.doctor === parseInt(selectedDoctor))
                  .map((avail) => (
                    <option key={avail.id} value={avail.start_time}>
                      {new Date(avail.start_time).toLocaleString()} -{' '}
                      {new Date(avail.end_time).toLocaleString()}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">Book Appointment</Button>
      </Form>
    </Container>
  );
}

export default PatientDashboard;
