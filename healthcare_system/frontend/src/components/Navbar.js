import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={{ marginBottom: '20px' }}>
      {user ? (
        <>
          <span>Welcome, {user.email} ({user.role})</span> | 
          <Link to="/dashboard">Dashboard</Link> | 
          <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </>
      ) : (
        <Link to="/">Login</Link>
      )}
    </nav>
  );
}
export default Navbar;
