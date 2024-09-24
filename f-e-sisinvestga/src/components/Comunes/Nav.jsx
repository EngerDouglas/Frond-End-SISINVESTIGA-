import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "../../features/auth/authSlice";
import "../../css/componentes/Comunes/Nav.css";

function Nav() {
  const role = useSelector(selectCurrentRole);

  return (
    <nav className="nav-bar">
      <div className="logo">UCSD</div>
      <ul className="nav-list">
        {!role && (
          <>
            {/* Enlaces que solo deben estar disponibles para no autenticados */}
            <li className="nav-item">
              <Link to="/registro" className="nav-link">
                Registro de Investigadores
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Login" className="nav-link">
                Iniciar Sesión
              </Link>
            </li>
          </>
        )}
        {role === "Administrador" && (
          <>
            {/* Enlaces solo visibles para administradores */}
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Panel de Administración
              </Link>
            </li>
          </>
        )}
        {role === "Investigador" && (
          <>
            {/* Enlaces solo visibles para investigadores */}
            <li className="nav-item">
              <Link to="/invest" className="nav-link">
                Panel de Investigador
              </Link>
            </li>
          </>
        )}
        {/* Enlace al perfil visible para cualquier usuario autenticado */}
        {role && (
          <li className="nav-item">
            <Link to="/perfil" className="nav-link">
              Perfil
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
