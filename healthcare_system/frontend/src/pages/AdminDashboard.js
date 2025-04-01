import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import api from '../api';

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients
        const patientRes = await api.get('/api/patients/');
        setPatients(patientRes.data);

        // Fetch doctors
        const doctorRes = await api.get('/api/doctors/doctors/');
        setDoctors(doctorRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/api/patients/${patientId}/`);
        setPatients(patients.filter((patient) => patient.id !== patientId));
        alert('Patient deleted successfully!');
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient.');
      }
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/api/doctors/doctors/${doctorId}/`);
        setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
        alert('Doctor deleted successfully!');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Failed to delete doctor.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h3>Admin Dashboard</h3>

      <h4>Manage Patients</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Insurance ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>{patient.insurance_id}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePatient(patient.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4>Manage Doctors</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteDoctor(doctor.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;
