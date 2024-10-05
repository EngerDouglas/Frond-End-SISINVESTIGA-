import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRole, logoutUser } from "../../features/auth/authSlice";
import AlertComponent from "./AlertComponent";
import "../../css/componentes/Comunes/NavAdmin.css";

const AdminNav = () => {
  const role = useSelector(selectCurrentRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    try {
      dispatch(logoutUser()).then(() => {
        navigate("/login");
      });
    } catch (error) {
      let errorMessage =
        "Ocurrió un error durante el proceso.";
      let detailedErrors = [];

      try {
        // Intentamos analizar el error recibido del backend
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.message;
        detailedErrors = parsedError.errors || [];
      } catch (parseError) {
        // Si no se pudo analizar, usamos el mensaje de error general
        errorMessage = error.message;
      }
      AlertComponent.error(errorMessage);
      detailedErrors.forEach((err) => AlertComponent.error(err));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  return (
    <nav className={`nav-admin-bar ${isLoaded ? "active" : ""}`}>
      <div className="logo-admin">UCSD</div>

      <ul className={`nav-admin-list ${isMenuOpen ? "active" : ""}`}>
        <li className="nav-admin-item">
          <button onClick={handleLogout} className="nav-link admin-btn">
            <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
          </button>
        </li>

        <li className="nav-admin-item dropdown">
          <button className="nav-link admin-btn" onClick={toggleMenu}>
            <i className="bi bi-list"></i> Menú
          </button>
          <ul className={`dropdown-menu ${isMenuOpen ? "show" : ""}`}>
            {role === "Administrador" && (
              <>
                <li className="dropdown-item">
                  <Link to="/admin" className="nav-admin-link">
                    <i className="bi bi-house-door"></i> Panel de Administración
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/auditoria" className="nav-admin-link">
                    <i className="bi bi-file-earmark-text"></i> Auditoría
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/proyectos" className="nav-admin-link">
                    <i className="bi bi-folder"></i> Proyectos
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/gestion-logs" className="nav-admin-link">
                    <i className="bi bi-file-earmark-lock"></i> Gestión de Logs
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/publicaciones" className="nav-admin-link">
                    <i className="bi bi-file-earmark-post"></i> Publicaciones
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/informes" className="nav-admin-link">
                    <i className="bi bi-file-earmark-bar-graph"></i> Informes
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/perfil" className="nav-admin-link">
                    <i className="bi bi-person"></i> Perfil
                  </Link>
                </li>
              </>
            )}
            {!role && (
              <>
                <li className="dropdown-item">
                  <Link to="/registro" className="nav-admin-link">
                    <i className="bi bi-person-plus"></i> Registro de
                    Investigadores
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/login" className="nav-admin-link">
                    <i className="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                  </Link>
                </li>
              </>
            )}
          </ul>
        </li>

        <li className="nav-admin-item">
          <button onClick={goBack} className="nav-link admin-btn">
            <i className="bi bi-arrow-left"></i> Atrás
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
