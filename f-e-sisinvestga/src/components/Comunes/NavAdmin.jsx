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
    <nav className="nav-bar">
      <div className="logo">UCSD</div>

      {/* Botón de menú hamburguesa */}
      <div className="menu-icon" onClick={toggleMenu}>
        <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </div>

      {/* Lista de botones */}
      <ul className={`nav-list ${isMenuOpen ? "active" : ""}`}>
        {/* Botón de Cerrar Sesión */}
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link btn-logout">
            Cerrar Sesión
          </button>
        </li>

        {/* Botón con todas las rutas en un menú desplegable */}
        <li className="nav-item dropdown">
          <button className="nav-link btn-dropdown">Menú</button>
          <ul className="dropdown-menu">
            {role === "Administrador" && (
              <>
                <li className="dropdown-item">
                  <Link to="/admin" className="nav-link">
                    Panel de Administración
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/auditoria" className="nav-link">
                    Auditoría
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/proyectos" className="nav-link">
                    Proyectos
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/gestion-logs" className="nav-link">
                    Gestión de Logs
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/publicaciones" className="nav-link">
                    Publicaciones
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/informes" className="nav-link">
                    Informes
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/perfil" className="nav-link">
                    Perfil
                  </Link>
                </li>
              </>
            )}
            {!role && (
              <>
                <li className="dropdown-item">
                  <Link to="/registro" className="nav-link">
                    Registro de Investigadores
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/login" className="nav-link">
                    Iniciar Sesión
                  </Link>
                </li>
              </>
            )}
          </ul>
        </li>

        {/* Botón de ir hacia atrás */}
        <li className="nav-item">
          <button onClick={goBack} className="nav-link btn-back">
            Atrás
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;
