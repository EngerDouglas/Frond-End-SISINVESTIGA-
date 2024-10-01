import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "../../features/auth/authSlice";
import "../../css/componentes/Comunes/NavAdmin.css"; // Asegúrate de que el CSS esté importado correctamente

const AdminNav = () => {
  const role = useSelector(selectCurrentRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    navigate("/logout");
  };

  const goBack = () => {
    navigate(-1);
  };

  // Activar la animación cuando la página se carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true); // Esto activa la clase 'active'
    }, 500); // Añadimos un ligero retraso para que se note la animación
  }, []);

  return (
    <nav className={`nav-admin-bar ${isLoaded ? "active" : ""}`}>
      <div className="logo-admin">UCSD</div>

      {/* Botón de menú hamburguesa */}
      <div className="menu-icon" onClick={toggleMenu}>
        <i className={`bi ${isMenuOpen ? "bi-x" : "bi-list"}`}></i>
      </div>

      {/* Lista de botones */}
      <ul className={`nav-admin-list ${isMenuOpen ? "active" : ""}`}>
        <li className="nav-admin-item">
          <button onClick={handleLogout} className="nav-link admin-btn-logout">
            <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
          </button>
        </li>

        <li className="nav-admin-item dropdown">
          <button className="nav-admin-link admin-btn-dropdown" onClick={toggleMenu}>
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
                    <i className="bi bi-person-plus"></i> Registro de Investigadores
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
          <button onClick={goBack} className="nav-admin-link admin-btn-back">
            <i className="bi bi-arrow-left"></i> Atrás
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
