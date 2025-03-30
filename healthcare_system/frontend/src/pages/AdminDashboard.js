import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', password: '' });
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', email: '', password: '' });

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [patRes, docRes, apptRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/patients/', config),
        axios.get('http://127.0.0.1:8000/api/doctors/', config),
        axios.get('http://127.0.0.1:8000/api/appointments/', config),
      ]);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setAppointments(apptRes.data.map(appt => ({
        ...appt,
        patient_name: patRes.data.find(p => p.id === appt.patient)?.name,
        doctor_name: docRes.data.find(d => d.id === appt.doctor)?.name,
      })));
    };
    if (token) fetchData();
  }, [token]);

  const handleCancel = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, config);
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const handleApprove = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.patch(`http://127.0.0.1:8000/api/appointments/${id}/`, { status: 'confirmed' }, config); // Removed unused updatedAppt
    setAppointments(appointments.map(a => (a.id === id ? { ...a, status: 'confirmed' } : a)));
  };

  const handleReject = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.patch(`http://127.0.0.1:8000/api/appointments/${id}/`, { status: 'cancelled' }, config); // Removed unused updatedAppt
    setAppointments(appointments.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a)));
  };

  const handleDeletePatient = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`http://127.0.0.1:8000/api/patients/${id}/`, config);
    setPatients(patients.filter(p => p.id !== id));
  };

  const handleDeleteDoctor = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}/`, config);
    setDoctors(doctors.filter(d => d.id !== id));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const userData = {
      email: newPatient.email,
      username: newPatient.email.split('@')[0], // Simple username from email
      password: newPatient.password,
      role: 'patient',
    };
    const userRes = await axios.post('http://127.0.0.1:8000/api/auth/users/', userData, config);
    const patientData = {
      user: userRes.data.id,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      insurance_id: 'INS_NEW', // Placeholder, adjust as needed
    };
    const patientRes = await axios.post('http://127.0.0.1:8000/api/patients/', patientData, config);
    setPatients([...patients, patientRes.data]);
    setNewPatient({ name: '', email: '', phone: '', password: '' });
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const userData = {
      email: newDoctor.email,
      username: newDoctor.email.split('@')[0], // Simple username from email
      password: newDoctor.password,
      role: 'doctor',
    };
    const userRes = await axios.post('http://127.0.0.1:8000/api/auth/users/', userData, config);
    const doctorData = {
      user: userRes.data.id,
      name: newDoctor.name,
      specialization: newDoctor.specialization,
    };
    const doctorRes = await axios.post('http://127.0.0.1:8000/api/doctors/', doctorData, config);
    setDoctors([...doctors, doctorRes.data]);
    setNewDoctor({ name: '', specialization: '', email: '', password: '' });
  };

  return (
    <Routes>
      <Route
        path="/patients"
        element={
          <div>
            <h3>Patients</h3>
            <Button variant="primary" href="/dashboard/patients/new" className="mb-3">Add Patient</Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDeletePatient(p.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        }
      />
      <Route
        path="/patients/new"
        element={
          <div>
            <h3>Add New Patient</h3>
            <Form onSubmit={handleCreatePatient}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPatient.password}
                  onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Create Patient</Button>
            </Form>
          </div>
        }
      />
      <Route
        path="/doctors"
        element={
          <div>
            <h3>Doctors</h3>
            <Button variant="primary" href="/dashboard/doctors/new" className="mb-3">Add Doctor</Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDeleteDoctor(d.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        }
      />
      <Route
        path="/doctors/new"
        element={
          <div>
            <h3>Add New Doctor</h3>
            <Form onSubmit={handleCreateDoctor}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Create Doctor</Button>
            </Form>
          </div>
        }
      />
      <Route
        path="/appointments"
        element={
          <div>
            <h3>All Appointments</h3>
            <Row>
              {appointments.map(a => (
                <Col md={4} key={a.id}>
                  <AppointmentCard appointment={a} onCancel={handleCancel} />
                  {a.status === 'pending' && (
                    <div className="mt-2">
                      <Button variant="success" onClick={() => handleApprove(a.id)} className="me-2">Approve</Button>
                      <Button variant="warning" onClick={() => handleReject(a.id)}>Reject</Button>
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </div>
        }
      />
    </Routes>
  );
}

export default AdminDashboard;
