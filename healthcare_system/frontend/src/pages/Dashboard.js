import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Please log in.</p>;

  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <p>Invalid role.</p>;
  }
}
export default Dashboard;
