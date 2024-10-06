import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, clearPasswordResetStatus } from '../../../features/auth/authSlice';
import AlertComponent from '../../Comunes/AlertComponent';
import logo from '../../../assets/img/LogoUCSD.jpg';
import '../../../css/componentes/Seguridad/ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearPasswordResetStatus());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      AlertComponent.error('Las contraseñas no coinciden');
      return;
    }
    dispatch(confirmPasswordReset({ token, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [status, navigate]);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <img src={logo} alt="Logo UCSD" className="logo" />
        <h1>Restablecer Contraseña</h1>
        <p>Ingrese su nueva contraseña.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva Contraseña"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Nueva Contraseña"
            required
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default ResetPassword