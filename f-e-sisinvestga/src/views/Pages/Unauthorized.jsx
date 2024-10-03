import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../features/auth/authSlice';
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
        return 'Volver al Panel de Administración';
      case 'Investigador':
        return 'Volver al Panel de Investigador';
      default:
        return 'Volver a la Página de Inicio';
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Acceso No Autorizado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <Link to={getRedirectLink()} className="nav-link">
          {getRedirectText()}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;