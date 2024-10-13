import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import AlertComponent from "../../Comunes/AlertComponent";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import logo from "../../../assets/img/LogoUCSD.jpg";
import backgroundStudy from "../../../assets/img/Study.png";
import "../../../css/componentes/Seguridad/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, error, status } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const goToForgotPassword = () => {
    navigate('/forgot-password');
  };

  useEffect(() => {
    if (error) {
      AlertComponent.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (user && !error) {
      AlertComponent.success(
        `Bienvenido, ${user.nombre} ${user.apellido}. Rol: ${role}`
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
          <h2>Iniciar Sesión</h2>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className={error && error.includes("password") ? "input-error" : ""}
              />
            </div>
            <button type="submit" className="submit-btn">
              {status === "loading" ? "Iniciando..." : (
                <>
                  <FaSignInAlt className="btn-icon" />
                  Iniciar Sesión
                </>
              )}
            </button>
            <button
              type="button"
              className="forgot-password-btn"
              onClick={goToForgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
          <div className="signup-option">
            <span>¿No tienes una cuenta?</span>{" "}
            <Link to="/register" className="signup-link">
              Regístrate
            </Link>
          </div>
          <footer className="footer">
            © {new Date().getFullYear()} Universidad Católica Santo Domingo - Todos los Derechos Reservados
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;