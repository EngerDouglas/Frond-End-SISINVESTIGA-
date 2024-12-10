import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaCheck } from 'react-icons/fa';
import { confirmPasswordReset, clearPasswordResetStatus } from '../../../features/auth/authSlice';
import AlertComponent from '../../Common/AlertComponent';
import logo from '../../../assets/img/LogoUCSD.jpg';
import backgroundImage from '../../../assets/img/ucsd.webp'; // Asume que tienes una imagen del campus
import '../../../css/auth/ResetPassword.css';

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
      AlertComponent.error('The passwords don\'t\' match');
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
    <div className="reset-password-page">
      <div className="reset-password-left">
        <img src={backgroundImage} alt="UCSD Campus" className="background-image" />
      </div>
      <div className="reset-password-right">
        <div className="reset-password-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo UCSD" className="logo" />
          </Link>
          <h1>Reset Password</h1>
          <p>Enter your new password.</p>
          <form onSubmit={handleSubmit} className='reset-form'>
            <div className="reset-input-group">
              <FaLock className="reset-input-icon" />
              <input
                className='reset-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </div>
            <div className="reset-input-group">
              <FaLock className="reset-input-icon" />
              <input
                className='reset-input'
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Resetting...' : (
                <>
                  <FaCheck className="reset-button-icon" />
                    Reset Password
                </>
              )}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <Link to="/login" className="reset-nav-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;