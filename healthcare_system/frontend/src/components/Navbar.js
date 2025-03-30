import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Login</Link> | <Link to="/book">Book Appointment</Link>
    </nav>
  );
}
export default Navbar;
