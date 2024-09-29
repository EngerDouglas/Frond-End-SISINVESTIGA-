import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom"; // Importa useNavigate
import AlertComponent from "../../Comunes/AlertComponent";
import logo from "../../../assets/img/LogoUCSD.jpg";
import backgroundStudy from "../../../assets/img/Study.png";
import "../../../css/componentes/Seguridad/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inicializa useNavigate
  const { user, role, error, status } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
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

      // Redirigir según el rol
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
  }, [user, role, error, navigate]); // Asegúrate de incluir navigate en la dependencia

  return (
    <div className="login-page">
      <div className="login-left">
        {/* Imagen de fondo */}
        <img
          src={backgroundStudy}
          alt="Background"
          className="login-background"
        />
      </div>
      <div className="login-right">
        <div className="login-container">
          <img src={logo} alt="UCSD Logo" className="login-logo" />
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={error && error.includes("email") ? "input-error" : ""}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className={
                error && error.includes("password") ? "input-error" : ""
              }
            />
            <button type="submit" className="submit-btn">
              {status === "loading" ? "Iniciando..." : "Iniciar Sesión"}
            </button>

            {/* Botón para recuperar contraseña */}
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() =>
                alert(
                  "Funcionalidad de recuperación de contraseña aún no implementada."
                )
              }
            >
              Se me olvidó la contraseña
            </button>

            {user && (
              <div className="success-message">
                <p>
                  Bienvenido, {user.nombre} {user.apellido}
                </p>
                <p>Has iniciado sesión como {role}</p>
              </div>
            )}
          </form>
          <div className="signup-option">
            <span>Don't have an account?</span>{" "}
            <Link to="/registro" className="signup-link">
              Sign up
            </Link>
          </div>
          {/* Pie de página */}
          <footer className="footer">
            © 2024 Universidad Católica Santo Domingo - Todos los Derechos
            Reservados
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
