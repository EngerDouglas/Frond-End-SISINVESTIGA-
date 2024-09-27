import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../../features/auth/authSlice";
import AlertComponent from "../../Comunes/AlertComponent";
import "../../../css/componentes/Seguridad/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { user, role, error, status } = useSelector((state) => state.auth);

  // Manejar el envío del formulario de inicio de sesión
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // Limpiar el mensaje de error
  const handleClearError = () => {
    dispatch(clearError());
  };

	 // Mostrar alerta si hay error
	useEffect(() => {
    if (error) {
      AlertComponent.error(error);
    }
  }, [error]);

  // Mostrar alerta de éxito si el usuario está logueado
  useEffect(() => {
    if (user && !error) {
      AlertComponent.success(`Bienvenido, ${user.nombre} ${user.apellido}. Rol: ${role}`);
    }
  }, [user, role, error]);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
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
          className={error && error.includes("password") ? "input-error" : ""}
        />
        <button type="submit" className="submit-btn">
          {status === "loading" ? "Iniciando..." : "Iniciar Sesión"}
        </button>

        {/* Mostrar mensajes de error incluyendo el caso de usuario deshabilitado */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleClearError}>Limpiar Error</button>
          </div>
        )}

        {/* Mostrar mensaje de éxito si el usuario está logueado */}
        {user && (
          <div className="success-message">
            <p>
              Bienvenido, {user.nombre} {user.apellido}
            </p>
            <p>Has iniciado sesión como {role}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
