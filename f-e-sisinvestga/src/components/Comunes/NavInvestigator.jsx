import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRole, logoutUser } from "../../features/auth/authSlice";
import {
  FaUserCircle,
  FaChevronDown,
  FaFolder,
  FaFileAlt,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaMoon,
  FaSun,
  FaTasks,
  FaBars,
} from "react-icons/fa";
import logo from "../../assets/img/LogoUCSD.jpg"; // Asegúrate de que el logo esté en la ruta correcta
import "../../css/componentes/GestionInvestigadores/NavInvestigator.css"; // Archivo CSS específico

const NavInvestigator = () => {
  const role = useSelector(selectCurrentRole); // Obtener el rol desde Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cerrar sesión
  const handleLogout = () => {
    try {
      dispatch(logoutUser()).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Toggle menú desplegable
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Alternar modo oscuro/claro
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <nav className="nav-investigator">
      <div className="nav-investigator-logo">
        <Link to="/invest">
          <img
            src={logo}
            alt="Logo UCSD"
            className="nav-investigator-logo-img"
          />
        </Link>
      </div>

      {/* Menú principal */}
      <ul className={`nav-investigator-list ${isMobileMenuOpen ? "open" : ""}`}>
        <li className="nav-investigator-item">
          <Link to="/proyectos" className="nav-investigator-link">
            <FaFolder /> Proyectos
          </Link>
        </li>
        <li className="nav-investigator-item">
          <Link to="/publicaciones" className="nav-investigator-link">
            <FaFileAlt /> Publicaciones
          </Link>
        </li>
        <li className="nav-investigator-item">
          <Link to="/informes" className="nav-investigator-link">
            <FaChartBar /> Informes
          </Link>
        </li>
        <li className="nav-investigator-item">
          <Link to="/solicitudes" className="nav-investigator-link">
            <FaTasks /> Solicitudes
          </Link>
        </li>
      </ul>

      {/* Botón para menú móvil */}
      <FaBars
        className="nav-investigator-mobile-menu-icon"
        onClick={toggleMobileMenu}
      />

      {/* Icono de notificaciones */}
      <div className="nav-investigator-notifications">
        <FaBell className="nav-investigator-bell" />
      </div>

      {/* Toggle modo oscuro */}
      <div className="nav-investigator-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? (
          <FaSun className="mode-icon" />
        ) : (
          <FaMoon className="mode-icon" />
        )}
      </div>

      {/* Menú de usuario */}
      {role === "Investigador" && (
        <div className="nav-investigator-user-menu">
          <div className="nav-investigator-user" onClick={toggleMenu}>
            <FaUserCircle className="nav-investigator-user-icon" />
            <span className="nav-investigator-user-name">Investigador</span>
            <FaChevronDown className="nav-investigator-dropdown-icon" />
          </div>
          {/* Menú desplegable */}
          {isMenuOpen && (
            <ul className="nav-investigator-dropdown">
              <li className="nav-investigator-dropdown-item">
                <Link to="/perfil-investigador" className="nav-investigator-dropdown-link">
                  <FaCog /> Configurar Perfil
                </Link>
              </li>
              <li className="nav-investigator-dropdown-item">
                <button
                  onClick={handleLogout}
                  className="nav-investigator-dropdown-link logout-btn"
                >
                  <FaSignOutAlt /> Cerrar Sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      )}

      {!role && (
        <div className="nav-investigator-login">
          <Link to="/login" className="nav-investigator-link">
            Iniciar Sesión
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavInvestigator;
