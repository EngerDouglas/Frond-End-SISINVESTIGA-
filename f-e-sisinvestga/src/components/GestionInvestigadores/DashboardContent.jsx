import React from "react";
import { FaFolder, FaFileAlt, FaTasks } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../../css/componentes/GestionInvestigadores/DashboardContent.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardContent = () => {
  const projectData = {
    labels: ["Activos", "Completados", "Pendientes"],
    datasets: [
      {
        label: "Proyectos",
        data: [12, 8, 5], // Ejemplo de datos
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
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
            <p>12</p>
          </div>
        </div>
        <div className="summary-card">
          <FaFileAlt className="summary-icon" />
          <div className="summary-info">
            <h3>Publicaciones</h3>
            <p>24</p>
          </div>
        </div>
        <div className="summary-card">
          <FaTasks className="summary-icon" />
          <div className="summary-info">
            <h3>Tareas Pendientes</h3>
            <p>5</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Proyectos */}
      <div className="dashboard-charts">
        <h2>Progreso de Proyectos</h2>
        <div className="chart-container">
          <Doughnut data={projectData} />
        </div>
      </div>

      {/* Tabla de Actividades Recientes */}
      <div className="dashboard-recent-activity">
        <h2>Actividades Recientes</h2>
        <table className="recent-activity-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Actividad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/10/2024</td>
              <td>Nuevo proyecto creado: "Investigación AI"</td>
              <td>
                <span className="status-completed">Completado</span>
              </td>
            </tr>
            <tr>
              <td>12/10/2024</td>
              <td>Publicación subida: "Machine Learning y su impacto"</td>
              <td>
                <span className="status-pending">Pendiente</span>
              </td>
            </tr>
            <tr>
              <td>08/10/2024</td>
              <td>Informe enviado: "Progreso del Q3"</td>
              <td>
                <span className="status-completed">Completado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;
