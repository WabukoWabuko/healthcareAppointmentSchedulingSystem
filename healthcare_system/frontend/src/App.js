import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/book" element={<AppointmentForm />} />
      </Routes>
    </Router>
  );
}
export default App;
