import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentToken, selectCurrentRole } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, roles, redirectPath = '/unauthorized' }) => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);

  useEffect(() => {
    if (!token) {
      // Si no hay token, redirige al login
      console.log('Token no encontrado en cookies, redirigiendo a /login');
    }
  }, [token]);

  console.log("Token en ProtectedRoute:", token);
  console.log("Role en ProtectedRoute:", role);

  if (!token) {
    return <Navigate to='/login' />;
  } else if(roles && !roles.includes(role)) {
    return <Navigate to={redirectPath} />
  }

  return children;
};

export default ProtectedRoute;