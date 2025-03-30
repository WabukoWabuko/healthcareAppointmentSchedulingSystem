import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Table, Button, Row, Col } from 'react-bootstrap'; // Added Row, Col
import AppointmentCard from '../components/AppointmentCard';

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

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

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <h4>Patients</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4 className="mt-4">Doctors</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.specialization}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4 className="mt-4">Appointments</h4>
      <Row>
        {appointments.map(a => (
          <Col md={4} key={a.id}>
            <AppointmentCard appointment={a} onCancel={handleCancel} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default AdminDashboard;
