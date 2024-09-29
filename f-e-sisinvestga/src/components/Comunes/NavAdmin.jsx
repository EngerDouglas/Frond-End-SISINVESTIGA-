import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "../../features/auth/authSlice";
import "../../css/componentes/Comunes/NavAdmin.css";

function AdminNav() {
  const role = useSelector(selectCurrentRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    navigate("/logout");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <nav className="nav-admin-bar">
      <div className="logo-admin">UCSD</div>

      {/* Botón de menú hamburguesa */}
      <div className="menu-icon" onClick={toggleMenu}>
        <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </div>

      {/* Lista de botones */}
      <ul className={`nav-admin-list ${isMenuOpen ? "active" : ""}`}>
        {/* Botón de Cerrar Sesión */}
        <li className="nav-admin-item">
          <button onClick={handleLogout} className="nav-link admin-btn-logout">
            Cerrar Sesión
          </button>
        </li>

        {/* Botón con todas las rutas en un menú desplegable */}
        <li className="nav-admin-item dropdown">
          <button className="nav-admin-link admin-btn-dropdown">Menú</button>
          <ul className="dropdown-menu">
            {role === "Administrador" && (
              <>
                <li className="dropdown-item">
                  <Link to="/admin" className="nav-admin-link">
                    Panel de Administración
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/auditoria" className="nav-admin-link">
                    Auditoría
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/proyectos" className="nav-admin-link">
                    Proyectos
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/gestion-logs" className="nav-admin-link">
                    Gestión de Logs
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/publicaciones" className="nav-admin-link">
                    Publicaciones
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/informes" className="nav-admin-link">
                    Informes
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/perfil" className="nav-admin-link">
                    Perfil
                  </Link>
                </li>
              </>
            )}
            {!role && (
              <>
                <li className="dropdown-item">
                  <Link to="/registro" className="nav-admin-link">
                    Registro de Investigadores
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/login" className="nav-admin-link">
                    Iniciar Sesión
                  </Link>
                </li>
              </>
            )}
          </ul>
        </li>

        {/* Botón de ir hacia atrás */}
        <li className="nav-admin-item">
          <button onClick={goBack} className="nav-admin-link admin-btn-back">
            Atrás
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;
