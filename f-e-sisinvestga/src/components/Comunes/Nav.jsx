import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "../../features/auth/authSlice";
import logo from "../../assets/img/LogoWebUCSD.png";
import "../../css/componentes/Comunes/Nav.css";

function Nav() {
  const role = useSelector(selectCurrentRole);

  return (
    <nav className="common-nav-bar">
      <div className="common-nav-container">
        <ul className="common-nav-list common-nav-left">
          <li className="common-nav-item">
            <Link to="/" className="common-nav-link">
              Inicio
            </Link>
          </li>
          <li className="common-nav-item">
            <Link to="/proyectos" className="common-nav-link">
              Proyectos
            </Link>
          </li>
          <li className="common-nav-item">
            <Link to="/publicaciones" className="common-nav-link">
              Publicaciones
            </Link>
          </li>
        </ul>

        <div className="common-logo-container">
          <Link to="/">
            <img src={logo} alt="UCSD Logo" className="common-nav-logo" />
          </Link>
        </div>

        <ul className="common-nav-list common-nav-right">
          {!role && (
            <li className="common-nav-item common-login-btn">
              <Link to="/login" className="common-nav-link">
                Iniciar Sesión
              </Link>
            </li>
          )}
          <li className="common-nav-item common-search-item">
            <div className="common-search-container">
              <input
                type="text"
                placeholder="Buscar..."
                className="common-search-input"
              />
              <button className="common-search-btn">🔍</button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
