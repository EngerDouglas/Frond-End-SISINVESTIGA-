import React, { useState, useEffect } from "react";
import { FaFolder, FaFileAlt, FaTasks } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getUserData } from "../../services/apiServices";
import "../../css/componentes/GestionInvestigadores/DashboardContent.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardContent = () => {
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [totalPublications, setTotalPublications] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del investigador
  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectos = await getUserData("projects");
        setProjects(proyectos.data || []); // Verificar que data exista

        const publicaciones = await getUserData("publications");
        setPublications(publicaciones.publications || []);
        setTotalPublications(publicaciones.total || 0);

        const solicitudes = await getUserData("requests");
        setRequests(solicitudes.data || []);
      } catch (error) {
        setError("Error al cargar los datos del dashboard");
        console.error(error); // Mostrar el error en la consola
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Datos para el gráfico de proyectos
  const projectData = {
    labels: ["Planeado", "En Proceso", "Finalizado", "Cancelado"],
    datasets: [
      {
        label: "Proyectos",
        data: [
          projects.filter((p) => p.estado === "Planeado").length,
          projects.filter((p) => p.estado === "En Proceso").length,
          projects.filter((p) => p.estado === "Finalizado").length,
          projects.filter((p) => p.estado === "Cancelado").length,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#03a9f4", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-content">
      {/* Panel de Resumen */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <FaFolder className="summary-icon" />
          <div className="summary-info">
            <h3>Proyectos Activos</h3>
            <p>
              {projects.filter((p) => p.estado === "En Proceso").length || 0}
            </p>
          </div>
        </div>
        <div className="summary-card">
          <FaFileAlt className="summary-icon" />
          <div className="summary-info">
            <h3>Publicaciones</h3>
            <p>{totalPublications}</p>
          </div>
        </div>
        <div className="summary-card">
          <FaTasks className="summary-icon" />
          <div className="summary-info">
            <h3>Solicitudes Pendientes</h3>
            <p>
              {requests.filter((r) => r.estado === "Pendiente").length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Proyectos */}
      <div className="dashboard-charts">
        <h2>Estado de Proyectos</h2>
        {projects.length > 0 ? (
          <div className="chart-container">
            <Doughnut
              data={projectData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        ) : (
          <p>No hay proyectos para mostrar</p>
        )}
      </div>

      {/* Tabla de Publicaciones Recientes */}
      <div className="dashboard-recent-publications">
        <h2>Publicaciones Recientes</h2>
        {publications.length > 0 ? (
          <table className="recent-publications-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Revista</th>
                <th>Estado</th>
                <th>Proyecto Asociado</th>
              </tr>
            </thead>
            <tbody>
              {publications.slice(0, 5).map((publication, index) => (
                <tr key={index}>
                  <td>{publication.titulo}</td>
                  <td>{publication.revista}</td>
                  <td>{publication.estado}</td>
                  <td>
                    {publication.proyecto ? publication.proyecto.nombre : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay publicaciones recientes</p>
        )}
      </div>

      {/* Tabla de Solicitudes Recientes */}
      <div className="dashboard-recent-requests">
        <h2>Solicitudes Recientes</h2>
        {requests.length > 0 ? (
          <table className="recent-requests-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo de Solicitud</th>
                <th>Estado</th>
                <th>Proyecto</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 5).map((request, index) => (
                <tr key={index}>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{request.tipoSolicitud}</td>
                  <td>{request.estado}</td>
                  <td>{request.proyecto ? request.proyecto.nombre : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay solicitudes recientes</p>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
