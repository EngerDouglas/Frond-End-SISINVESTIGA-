import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { requestPasswordReset, clearPasswordResetStatus } from '../../../features/auth/authSlice';
import logo from '../../../assets/img/LogoUCSD.jpg';
import '../../../css/componentes/Seguridad/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { status, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearPasswordResetStatus());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email));
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <img src={logo} alt="Logo UCSD" className="logo" />
        <h1>Recuperar Contraseña</h1>
        <p>Ingrese su correo electrónico para recibir instrucciones de recuperación.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <Link to="/login" className="nav-link">Volver al Inicio de Sesión</Link>
      </div>
    </div>
  );
};

export default ForgotPassword