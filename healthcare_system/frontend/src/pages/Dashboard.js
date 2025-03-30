import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';
import { Container, Row, Col } from 'react-bootstrap';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on role immediately after login
      switch (user.role) {
        case 'patient':
          navigate('/dashboard/appointments');
          break;
        case 'doctor':
          navigate('/dashboard/appointments');
          break;
        case 'admin':
          navigate('/dashboard/patients');
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  if (!user) return <p className="text-center mt-5">Please log in.</p>;

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <Sidebar />
        </Col>
        <Col md={9}>
          <Routes>
            {user.role === 'patient' && <Route path="/*" element={<PatientDashboard />} />}
            {user.role === 'doctor' && <Route path="/*" element={<DoctorDashboard />} />}
            {user.role === 'admin' && <Route path="/*" element={<AdminDashboard />} />}
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
