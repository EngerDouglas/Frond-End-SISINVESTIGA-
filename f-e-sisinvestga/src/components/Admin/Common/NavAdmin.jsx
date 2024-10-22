import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRole, logoutUser } from "../../../features/auth/authSlice";
import "../../../css/Admin/NavAdmin.css";
import logo from '../../../assets/img/LogoWebUCSD.png';

const AdminNav = () => {
  const role = useSelector(selectCurrentRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Ocurrió un error durante el proceso de cierre de sesión.");
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
      <div className="logo-admin">
        <img src={logo} alt="UCSD Logo" className="nav-logo" />
      </div>

      <ul className={`nav-admin-list ${isMenuOpen ? "active" : ""}`}>
        {/* Move the menu button before the logout button */}
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
                  <Link to="/admin/listarproyectos" className="nav-admin-link">
                    <i className="bi bi-folder"></i> Proyectos
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/admin/gestion-logs" className="nav-admin-link">
                    <i className="bi bi-file-earmark-lock"></i> Gestión de Logs
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/admin/publicaciones" className="nav-admin-link">
                    <i className="bi bi-file-earmark-post"></i> Publicaciones
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/admin/informes" className="nav-admin-link">
                    <i className="bi bi-file-earmark-bar-graph"></i> Informes
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/admin/gestionInvestigadores" className="nav-admin-link">
                    <i className="bi bi-person-lines-fill"></i> Gestión de Investigadores
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/admin/solicitudes" className="nav-admin-link">
                    <i className="bi bi-bell"></i> Solicitudes
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/admin/configuracion-perfil" className="nav-admin-link">
                    <i className="bi bi-gear"></i> Configuración de Perfil
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
          <button onClick={handleLogout} className="nav-link admin-btn">
            <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
          </button>
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
