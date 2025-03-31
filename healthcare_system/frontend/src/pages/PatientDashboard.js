import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

function PatientDashboard() {
  const { token } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [datetime, setDatetime] = useState('');
  const [patientId, setPatientId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [docRes, apptRes, patientRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/doctors/', config),
          axios.get('http://127.0.0.1:8000/api/appointments/', config),
          axios.get('http://127.0.0.1:8000/api/patients/', config),
        ]);
        console.log('Doctors:', docRes.data);
        console.log('Appointments:', apptRes.data);
        console.log('Patient:', patientRes.data);
        setDoctors(docRes.data);
        setAppointments(apptRes.data.map(appt => ({
          ...appt,
          doctor_name: docRes.data.find(d => d.id === appt.doctor)?.name,
        })));
        setPatientId(patientRes.data[0]?.id || '');
      } catch (error) {
        console.error('Error fetching patient data:', error.response?.data || error.message);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleBook = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/appointments/',
        { patient: patientId, doctor: doctorId, datetime, status: 'pending' },
        config
      );
      setAppointments([...appointments, { ...res.data, doctor_name: doctors.find(d => d.id === res.data.doctor).name }]);
      setDoctorId('');
      setDatetime('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorDetail = error.response?.data?.datetime || error.response?.data?.detail || 'Unknown error';
      setErrorMessage(`Failed to book appointment: ${errorDetail}`);
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
      {location.pathname.includes('/book') ? (
        <div>
          <h3>Book an Appointment</h3>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <Row>
            <Col md={6}>
              <Form onSubmit={handleBook}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Book</Button>
              </Form>
            </Col>
          </Row>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default PatientDashboard;
