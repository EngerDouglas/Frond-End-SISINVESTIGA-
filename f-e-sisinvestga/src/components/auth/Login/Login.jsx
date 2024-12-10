import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import AlertComponent from "../../Common/AlertComponent";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../../../assets/img/LogoUCSD.jpg";
import backgroundStudy from "../../../assets/img/Study.png";
import "../../../css/auth/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, error, status } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      AlertComponent.error("Please complete the reCAPTCHA");
      return;
    }
    dispatch(loginUser({ email, password, recaptchaToken }));
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const goToForgotPassword = () => {
    navigate('/forgot-password');
  };

  useEffect(() => {
    if (error) {
      AlertComponent.error(error);
      recaptchaRef.current.reset();
      setRecaptchaToken(null);
    }
  }, [error]);

  useEffect(() => {
    if (user && !error) {
      AlertComponent.success(
        `Welcome, ${user.nombre} ${user.apellido}. Rol: ${role}`
      );

      switch (role) {
        case "Administrador":
          navigate("/admin");
          break;
        case "Investigador":
          navigate("/invest");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, role, error, navigate]);

  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src={backgroundStudy}
          alt="Background"
          className="login-background"
        />
      </div>
      <div className="login-right">
        <div className="login-container">
          <Link to='/' className="logo-link">
            <img src={logo} alt="UCSD Logo" className="login-logo" />
          </Link>
          <h2>Log In</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={error && error.includes("email") ? "input-error" : ""}
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={error && error.includes("password") ? "input-error" : ""}
              />
            </div>
            <div className="recaptcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!recaptchaToken || status === "loading"}
            >
              {status === "loading" ? "Logging in..." : (
                <>
                  <FaSignInAlt className="btn-icon" />
                    Log In
                </>
              )}
            </button>
            <button
              type="button"
              className="forgot-password-btn"
              onClick={goToForgotPassword}
            >
              Forgot your password?
            </button>
          </form>
          <div className="signup-option">
            <span>Don't have an account?</span>{" "}
            <Link to="/register" className="signup-link">
              Sign Up
            </Link>
          </div>
          <footer className="footer">
            © {new Date().getFullYear()} Universidad Católica Santo Domingo - All Rights Reserved
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;