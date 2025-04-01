import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/doctors/', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setDoctors(res.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setErrorMessage('Failed to load doctors.');
      }
    };
    fetchDoctors();
  }, []);

  // Fetch availabilities when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      const fetchAvailabilities = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://127.0.0.1:8000/api/availabilities/', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          const doctorAvailabilities = res.data.filter(
            (avail) => avail.doctor.id === parseInt(selectedDoctor)
          );
          setAvailabilities(doctorAvailabilities);
        } catch (error) {
          console.error('Error fetching availabilities:', error);
          setErrorMessage('Failed to load availabilities.');
        }
      };
      fetchAvailabilities();
    }
  }, [selectedDoctor]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedAvailability) {
      setErrorMessage('Please select a doctor and an availability slot.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:8000/api/appointments/',
        {
          doctor: selectedDoctor,
          datetime: availabilities.find((avail) => avail.id === parseInt(selectedAvailability)).start_time,
          status: 'pending',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSuccessMessage('Appointment booked successfully!');
      setErrorMessage('');
      setSelectedDoctor('');
      setSelectedAvailability('');
      setAvailabilities([]);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setErrorMessage('Failed to book appointment: ' + (error.response?.data?.detail || 'Unknown error'));
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h3>Book an Appointment</h3>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <Row>
        <Col md={6}>
          <Form onSubmit={handleBookAppointment}>
            <Form.Group className="mb-3">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedDoctor && (
              <Form.Group className="mb-3">
                <Form.Label>Select Availability</Form.Label>
                <Form.Select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  required
                >
                  <option value="">-- Select a Time Slot --</option>
                  {availabilities.map((avail) => (
                    <option key={avail.id} value={avail.id}>
                      {new Date(avail.start_time).toLocaleString()} -{' '}
                      {new Date(avail.end_time).toLocaleString()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Book Appointment
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default BookAppointment;
