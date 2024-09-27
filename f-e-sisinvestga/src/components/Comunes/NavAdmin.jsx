import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRole } from "../../features/auth/authSlice";
import "../../css/componentes/Comunes/NavAdmin.css";

function AdminNav() {
  const role = useSelector(selectCurrentRole);

  return (
    <nav className="nav-bar">
      <div className="logo">UCSD</div>
      <ul className="nav-list">
        {role === "Administrador" && (
          <>
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Panel de Administración
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/auditoria" className="nav-link">
                Auditoría
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/proyectos" className="nav-link">
                Proyectos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/gestion-logs" className="nav-link">
                Gestión de Logs
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/publicaciones" className="nav-link">
                Publicaciones
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/informes" className="nav-link">
                Informes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/perfil" className="nav-link">
                Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/logout" className="nav-link">
                Cerrar Sesión
              </Link>
            </li>
          </>
        )}
        {/* Enlaces que solo deben estar disponibles para no autenticados */}
        {!role && (
          <>
            <li className="nav-item">
              <Link to="/registro" className="nav-link">
                Registro de Investigadores
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default AdminNav;
