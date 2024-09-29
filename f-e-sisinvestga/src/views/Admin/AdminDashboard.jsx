import React from "react";
import { useNavigate } from "react-router-dom";
import NavAdmin from '../../components/Comunes/NavAdmin';
import "../../css/Pages/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <NavAdmin />
      <div className="admin-dashboard">
        <h1 className="name">Panel de Administración</h1>

        <div className="dashboard-container">
          {/* Other dashboard boxes */}
          
          <div className="dashboard-card">
            <h2>Gestión de Proyectos</h2>
            <p>Administrar todos los proyectos en la plataforma.</p>
            <button
              onClick={() => handleNavigation("/listarproyectos")}
              className="admin-btn-card"
            >
              Ir a Proyectos
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Gestión de Investigadores</h2>
            <p>Administrar investigadores y su información.</p>
            <button
              onClick={() => handleNavigation("/gestionInvestigadores")}
              className="admin-btn-card"
            >
              Ir a Investigadores
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Auditoría</h2>
            <p>Revisar el historial de actividades.</p>
            <button
              onClick={() => handleNavigation("/auditoria")}
              className="admin-btn-card"
            >
              Ir a Auditoría
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Gestión de Logs</h2>
            <p>Revisar y gestionar logs del sistema.</p>
            <button
              onClick={() => handleNavigation("/gestion-logs")}
              className="admin-btn-card"
            >
              Ir a Logs
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Publicaciones</h2>
            <p>Administrar las publicaciones de los investigadores.</p>
            <button
              onClick={() => handleNavigation("/publicaciones")}
              className="admin-btn-card"
            >
              Ir a Publicaciones
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Informes</h2>
            <p>Generar y revisar informes de actividades.</p>
            <button
              onClick={() => handleNavigation("/informes")}
              className="admin-btn-card"
            >
              Ir a Informes
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
