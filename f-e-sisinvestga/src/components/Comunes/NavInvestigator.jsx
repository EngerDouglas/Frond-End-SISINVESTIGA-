import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import AlertComponent from "./AlertComponent";
import {
  FaUserCircle,
  FaChevronDown,
  FaFolder,
  FaFileAlt,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaTasks,
  FaArrowLeft,
  FaBars,
  FaTimes
} from "react-icons/fa";
import logo from "../../assets/img/LogoUCSD.jpg";
import "../../css/componentes/GestionInvestigadores/NavInvestigator.css";

const NavInvestigator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      dispatch(logoutUser()).then(() => {
        navigate("/login");
      });
    } catch (error) {
      let errorMessage = "Ocurrió un error durante el proceso.";
      let detailedErrors = [];

      try {
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.message;
        detailedErrors = parsedError.errors || [];
      } catch (parseError) {
        errorMessage = error.message;
      }
      AlertComponent.error(errorMessage);
      detailedErrors.forEach((err) => AlertComponent.error(err));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const goBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/invest";

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener('resize', closeMenus);
    return () => window.removeEventListener('resize', closeMenus);
  }, []);

  return (
    <nav className={`nav-investigator ${isHomePage ? 'home-page' : ''}`}>
      <div className="nav-investigator-logo">
        <Link to="/invest">
          <img src={logo} alt="Logo UCSD" className="nav-investigator-logo-img" />
        </Link>
        {!isHomePage && (
          <span className="nav-investigator-university-name">Universidad Católica de Santo Domingo</span>
        )}
      </div>

      <button className="nav-investigator-mobile-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`nav-investigator-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/invest/proyectos" className="nav-investigator-menu-item" onClick={closeMenus}>
          <FaFolder /> Proyectos
        </Link>
        <Link to="/invest/publicaciones" className="nav-investigator-menu-item" onClick={closeMenus}>
          <FaFileAlt /> Publicaciones
        </Link>
        <Link to="/invest/informes" className="nav-investigator-menu-item" onClick={closeMenus}>
          <FaChartBar /> Informes
        </Link>
        <Link to="/invest/solicitudes" className="nav-investigator-menu-item" onClick={closeMenus}>
          <FaTasks /> Solicitudes
        </Link>
      </div>

      <div className={`nav-investigator-actions ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="nav-investigator-icon-btn">
          <FaBell />
        </button>
        {!isHomePage && (
          <button onClick={goBack} className="nav-investigator-back-btn">
            <FaArrowLeft /> Atrás
          </button>
        )}
        <div className="nav-investigator-user-menu">
          <button onClick={toggleMenu} className="nav-investigator-user-btn">
            <FaUserCircle /> Investigador <FaChevronDown />
          </button>
          {isMenuOpen && (
            <ul className="nav-investigator-dropdown">
              <li>
                <Link to="/invest/perfil-investigador" className="nav-investigator-dropdown-link" onClick={closeMenus}>
                  <FaCog /> Configurar Perfil
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-investigator-dropdown-link">
                  <FaSignOutAlt /> Cerrar Sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavInvestigator;