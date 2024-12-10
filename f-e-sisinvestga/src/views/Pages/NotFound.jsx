import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../features/auth/authSlice';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import logo from '../../assets/img/LogoUCSD.jpg'
import '../../css/Pages/NotAcces.css';

const NotFound = () => {
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
          <FaExclamationTriangle />
        </div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to={getRedirectLink()} className="not-nav-link">
          <FaArrowLeft className="icon-left" />
          {getRedirectText()}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;