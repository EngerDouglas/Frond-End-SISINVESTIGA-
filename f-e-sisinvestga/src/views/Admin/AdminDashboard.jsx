import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavAdmin from '../../components/Common/NavAdmin';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getData, getDataParams } from '../../services/apiServices';
import "../../css/Pages/AdminDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, enabled: 0, disabled: 0 },
    projects: { total: 0, inProgress: 0, completed: 0, deleted: 0 },
    publications: { total: 0, published: 0, inReview: 0, deleted: 0 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersData = await getData('users');
        const projectsData = await getDataParams('projects', { includeDeleted: true });
        const publicationsData = await getDataParams('publications', { includeDeleted: true });

        setStats({
          users: {
            total: usersData.length,
            active: usersData.filter(user => user.isActive).length,
            enabled: usersData.filter(user => !user.isDisabled).length,
            disabled: usersData.filter(user => user.isDisabled).length
          },
          projects: {
            total: projectsData.total,
            inProgress: projectsData.projects.filter(project => project.estado === 'En Proceso').length,
            completed: projectsData.projects.filter(project => project.estado === 'Finalizado').length,
            deleted: projectsData.projects.filter(project => project.isDeleted).length
          },
          publications: {
            total: publicationsData.total,
            published: publicationsData.publications.filter(pub => pub.estado === 'Publicado').length,
            inReview: publicationsData.publications.filter(pub => pub.estado === 'Revisado').length,
            deleted: publicationsData.publications.filter(pub => pub.isDeleted).length
          }
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Here you might want to show an error message to the user
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const createChartData = (data, labels, colors) => ({
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  });

  const userChartData = createChartData(
    [stats.users.active, stats.users.total - stats.users.active],
    ['Activos', 'Inactivos'],
    ['#36A2EB', '#FF6384']
  );

  const projectChartData = createChartData(
    [stats.projects.inProgress, stats.projects.completed, stats.projects.deleted],
    ['En Proceso', 'Completados', 'Eliminados'],
    ['#FFCE56', '#4BC0C0', '#FF6384']
  );

  const publicationChartData = createChartData(
    [stats.publications.published, stats.publications.inReview, stats.publications.deleted],
    ['Publicados', 'Revisado', 'Eliminados'],
    ['#4BC0C0', '#FFCE56', '#FF6384']
  );

  return (
    <div>
      <NavAdmin />
      <div className="admin-dashboard">
        <h1 className="name">Panel de Administración</h1>

        <div className="stats-container">
          <div className="stats-card">
            <h2>Estadísticas de Usuarios</h2>
            <p>Total: {stats.users.total}</p>
            <p>Activos: {stats.users.active}</p>
            <p>Habilitados: {stats.users.enabled}</p>
            <p>Deshabilitados: {stats.users.disabled}</p>
            <div className="chart-container">
              <Pie data={userChartData} />
            </div>
          </div>

          <div className="stats-card">
            <h2>Estadísticas de Proyectos</h2>
            <p>Total: {stats.projects.total}</p>
            <p>En Proceso: {stats.projects.inProgress}</p>
            <p>Completados: {stats.projects.completed}</p>
            <p>Eliminados: {stats.projects.deleted}</p>
            <div className="chart-container">
              <Pie data={projectChartData} />
            </div>
          </div>

          <div className="stats-card">
            <h2>Estadísticas de Publicaciones</h2>
            <p>Total: {stats.publications.total}</p>
            <p>Publicadas: {stats.publications.published}</p>
            <p>Revisado: {stats.publications.inReview}</p>
            <p>Eliminadas: {stats.publications.deleted}</p>
            <div className="chart-container">
              <Pie data={publicationChartData} />
            </div>
          </div>
        </div>

        <div className="dashboard-container">
          {/* Existing dashboard cards */}
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

          <div className="dashboard-card">
            <h2><i className="bi bi-gear"></i> Configuración de Perfil</h2>
            <p>Administrar y actualizar la configuración del perfil.</p>
            <button
              onClick={() => handleNavigation("/admin/confprofile")}
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
