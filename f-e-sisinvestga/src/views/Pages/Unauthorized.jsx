import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../features/auth/authSlice';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import logo from '../../assets/img/LogoUCSD.jpg'
import '../../css/Pages/NotAcces.css';

const Unauthorized = () => {
  const role = useSelector(selectCurrentRole);

  const getRedirectLink = () => {
    switch (role) {
      case 'Administrador':
        return '/admin';
      case 'Investigador':
        return '/invest';
      default:
        return '/';
    }
  };

  const getRedirectText = () => {
    switch (role) {
      case 'Administrador':
        return 'Return to the Admin Panel';
      case 'Investigador':
        return 'Return to the Research Panel';
      default:
        return 'Return to the Home Page';
    }
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo UCSD" className="logo" />
        </Link>
        <div className="error-icon">
          <FaLock />
        </div>
        <h1>403 - Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
        <Link to={getRedirectLink()} className="not-nav-link">
          <FaArrowLeft className="icon-left" />
          {getRedirectText()}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;