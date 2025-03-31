import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', password: '' });
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', email: '', password: '' });
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [patRes, docRes, apptRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/patients/', config),
          axios.get('http://127.0.0.1:8000/api/doctors/', config),
          axios.get('http://127.0.0.1:8000/api/appointments/', config),
        ]);
        console.log('Patients:', patRes.data);
        console.log('Doctors:', docRes.data);
        console.log('Appointments:', apptRes.data);
        setPatients(patRes.data);
        setDoctors(docRes.data);
        setAppointments(apptRes.data.map(appt => ({
          ...appt,
          patient_name: patRes.data.find(p => p.id === appt.patient)?.name,
          doctor_name: docRes.data.find(d => d.id === appt.doctor)?.name,
        })));
      } catch (error) {
        console.error('Error fetching admin data:', error.response?.data || error.message);
      }
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
    await axios.patch(`http://127.0.0.1:8000/api/appointments/${id}/`, { status: 'confirmed' }, config);
    setAppointments(appointments.map(a => (a.id === id ? { ...a, status: 'confirmed' } : a)));
  };

  const handleReject = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.patch(`http://127.0.0.1:8000/api/appointments/${id}/`, { status: 'cancelled' }, config);
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
      username: newPatient.email.split('@')[0],
      password: newPatient.password,
      role: 'patient',
    };
    const userRes = await axios.post('http://127.0.0.1:8000/api/auth/users/', userData, config);
    const patientData = {
      user: userRes.data.id,
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      insurance_id: 'INS_NEW',
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
      username: newDoctor.email.split('@')[0],
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
    <div>
      {location.pathname.includes('/patients/new') ? (
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
      ) : location.pathname.includes('/doctors/new') ? (
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
      ) : location.pathname.includes('/doctors') ? (
        <div>
          <h3>Doctors</h3>
          <Button variant="primary" as={Link} to="/dashboard/doctors/new" className="mb-3">Add Doctor</Button>
          {doctors.length ? (
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
          ) : (
            <p>No doctors found.</p>
          )}
        </div>
      ) : location.pathname.includes('/appointments') ? (
        <div>
          <h3>All Appointments</h3>
          {appointments.length ? (
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
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      ) : (
        <div>
          <h3>Patients</h3>
          <Button variant="primary" as={Link} to="/dashboard/patients/new" className="mb-3">Add Patient</Button>
          {patients.length ? (
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
          ) : (
            <p>No patients found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
