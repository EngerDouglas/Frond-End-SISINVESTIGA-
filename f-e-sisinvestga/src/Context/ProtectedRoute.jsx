import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentToken, selectCurrentRole } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, roles, redirectPath = '/unauthorized' }) => {
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);

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