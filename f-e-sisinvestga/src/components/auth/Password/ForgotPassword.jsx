import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { requestPasswordReset, clearPasswordResetStatus } from '../../../features/auth/authSlice';
import logo from '../../../assets/img/LogoUCSD.jpg';
import backgroundImage from '../../../assets/img/ucsd.webp';
import '../../../css/auth/ForgotPassword.css';

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
    <div className="forgot-password-page">
      <div className="forgot-password-left">
        <img src={backgroundImage} alt="UCSD Campus" className="background-image" />
      </div>
      <div className="forgot-password-right">
        <div className="forgot-password-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo UCSD" className="logo" />
          </Link>
          <h1>Reset Password</h1>
          <p>Enter your email to receive recovery instructions.</p>
          <form onSubmit={handleSubmit} className='forgot-form'>
            <div className="forgot-input-group">
              <FaEnvelope className="forgot-input-icon" />
              <input 
                className='forgot-inputs'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : (
                <>
                  <FaPaperPlane className="button-icon" />
                    Send Instructions
                </>
              )}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <Link to="/login" className="forgot-nav-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;