import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { verifyUserEmail } from '../../../features/auth/authSlice';
import AlertComponent from '../../Comunes/AlertComponent';
import backgroundImage from '../../../assets/img/ucsd.webp'; 
import logo from '../../../assets/img/LogoUCSD.jpg';
import '../../../css/componentes/Seguridad/VerifyEmail.css';


const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const { status, error, success } = useSelector((state) => state.auth);

  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    if (token && !verificationAttempted) {
      console.log('Enviando verificación con token:', token);
      dispatch(verifyUserEmail(token));
      setVerificationAttempted(true);
    }
  }, [dispatch, token, verificationAttempted]);

  useEffect(() => {
    if (status === 'succeeded') {
      setIsVerifying(false);
      AlertComponent.success(success);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else if (status === 'failed') {
      setIsVerifying(false);
      AlertComponent.error(error);
    }
  }, [status, error, success, navigate]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-left">
        <img src={backgroundImage} alt="UCSD Campus" className="background-image" />
      </div>
      <div className="verify-email-right">
        <div className="verify-email-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo UCSD" className="logo" />
          </Link>
          <h1>Verificación de Email</h1>
          {isVerifying ? (
            <p>Verificando su email, por favor espere...</p>
          ) : status === 'succeeded' ? (
            <div className="verification-success">
              <FaCheckCircle className="icon success" />
              <p>{success}</p>
            </div>
          ) : (
            <div className="verification-error">
              <FaExclamationTriangle className="icon error" />
              <p>{error}</p>
            </div>
          )}
          <Link to="/login" className="verify-nav-link">Volver al Inicio de Sesión</Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail