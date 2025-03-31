import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
