import React from "react";
import { Link } from "react-router-dom";
import NavAdmin from '../../components/Comunes/NavAdmin'
import "../../css/Pages/AdminDashboard.css"; // Ensure this CSS file is created


const AdminDashboard = () => {
  return (
    <div>
      <NavAdmin></NavAdmin>
      <div className="admin-dashboard">
      <h1>Panel de Administración</h1>

      <div className="dashboard-container">
        {/* Other dashboard boxes */}
        
        <div className="dashboard-card">
          <h2>Gestión de Proyectos</h2>
          <p>Administrar todos los proyectos en la plataforma.</p>
          <Link to="/listarproyectos" className="btn-card">Ir a Proyectos</Link>
        </div>

        <div className="dashboard-card">
          <h2>Gestión de Investigadores</h2>
          <p>Administrar investigadores y su información.</p>
          <Link to="/gestionInvestigadores" className="btn-card">Ir a Gestión de Investigadores</Link>
        </div>

        <div className="dashboard-card">
          <h2>Auditoría</h2>
          <p>Revisar el historial de actividades.</p>
          <Link to="/auditoria" className="btn-card">Ir a Auditoría</Link>
        </div>

        <div className="dashboard-card">
          <h2>Gestión de Logs</h2>
          <p>Revisar y gestionar logs del sistema.</p>
          <Link to="/gestion-logs" className="btn-card">Ir a Logs</Link>
        </div>

        <div className="dashboard-card">
          <h2>Publicaciones</h2>
          <p>Administrar las publicaciones de los investigadores.</p>
          <Link to="/publicaciones" className="btn-card">Ir a Publicaciones</Link>
        </div>

        <div className="dashboard-card">
          <h2>Informes</h2>
          <p>Generar y revisar informes de actividades.</p>
          <Link to="/informes" className="btn-card">Ir a Informes</Link>
        </div>
      </div>
    </div>
      </div>
  );
};

export default AdminDashboard;
