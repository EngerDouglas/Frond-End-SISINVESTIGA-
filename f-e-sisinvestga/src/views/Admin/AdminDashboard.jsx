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
            <h2><i className="bi bi-folder2"></i> Gestión de Proyectos</h2>
            <p>Administrar todos los proyectos en la plataforma.</p>
            <button
              onClick={() => handleNavigation("/admin/listarproyectos")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Proyectos
            </button>
          </div>

          <div className="dashboard-card">
            <h2><i className="bi bi-person-lines-fill"></i> Gestión de Investigadores</h2>
            <p>Administrar investigadores y su información.</p>
            <button
              onClick={() => handleNavigation("/admin/gestionInvestigadores")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Investigadores
            </button>
          </div>

          <div className="dashboard-card">
            <h2><i className="bi bi-file-earmark-text"></i> Auditoría</h2>
            <p>Revisar el historial de actividades.</p>
            <button
              onClick={() => handleNavigation("/admin/auditoria")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Auditoría
            </button>
          </div>

          <div className="dashboard-card">
            <h2><i className="bi bi-journal-text"></i> Gestión de Logs</h2>
            <p>Revisar y gestionar logs del sistema.</p>
            <button
              onClick={() => handleNavigation("/admin/gestion-logs")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Logs
            </button>
          </div>

          <div className="dashboard-card">
            <h2><i className="bi bi-file-earmark-person"></i> Publicaciones</h2>
            <p>Administrar las publicaciones de los investigadores.</p>
            <button
              onClick={() => handleNavigation("/admin/publicaciones")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Publicaciones
            </button>
          </div>

          <div className="dashboard-card">
            <h2><i className="bi bi-bell"></i> Solicitudes</h2>
            <p>Solicitud para agregar investigadores a proyectos.</p>
            <button
              onClick={() => handleNavigation("/admin/solicitudes")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Solicitudes
            </button>
          </div>

          <div className="dashboard-card">
            <h2><i className="bi bi-file-earmark-bar-graph"></i> Informes</h2>
            <p>Generar y revisar informes de actividades.</p>
            <button
              onClick={() => handleNavigation("/admin/informes")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Informes
            </button> 
          </div>

          {/* Nueva carta de Configuración de Perfil */}
          <div className="dashboard-card">
            <h2><i className="bi bi-gear"></i> Configuración de Perfil</h2>
            <p>Administrar y actualizar la configuración del perfil.</p>
            <button
              onClick={() => handleNavigation("/admin/configuracion-perfil")}
              className="admin-btn-card"
            >
              <i className="bi bi-arrow-right"></i> Ir a Configuración
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
