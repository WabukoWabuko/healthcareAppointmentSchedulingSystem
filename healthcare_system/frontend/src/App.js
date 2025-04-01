import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard/*" element={<DoctorDashboard />} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
