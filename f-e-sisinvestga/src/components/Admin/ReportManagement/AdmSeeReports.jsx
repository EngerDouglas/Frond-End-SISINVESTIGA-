import React, { useState, useEffect, useCallback } from "react";
import { FaFileCsv, FaFilePdf, FaSpinner, FaChartBar, FaProjectDiagram, FaStar } from "react-icons/fa";
import AlertComponent from "../../Common/AlertComponent";
import { getDataParams, getFiles } from "../../../services/apiServices";
import AdmPagination from '../Common/AdmPagination';
import SearchBar from "../../Common/SearchBar";
import '../../../css/Admin/AdmReportView.css';

const AdmSeeReports = () => {
  const [loading, setLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([]);
  const [evaluationsData, setEvaluationsData] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const data = await getDataParams("projects", { currentPage, limit: 10, search: searchTerm });
        if (data) {
          setProjectsData(data.projects); // Ajusta según la estructura real
          setTotalPages(data.totalPages);
        }
      } else {
        const data = await getDataParams("evaluations/all", { currentPage, limit: 10, search: searchTerm });
        if (data) {
          setEvaluationsData(data.evaluations);
          setTotalPages(data.totalPages);
        }
      }
    } catch (error) {
      console.error(`Error al cargar los ${activeTab}:`, error);
      AlertComponent.error(`Error al cargar los ${activeTab}. Por favor, inténtelo de nuevo.`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateReport = async (format) => {
    setLoading(true);
    try {
      const reportType = activeTab === "projects" ? "projects" : "evaluations";
      const response = await getFiles(`reports/admin/${reportType}/${format}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: format === "csv" ? "text/csv" : "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let filename = `${reportType}_report.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      AlertComponent.success(
        `Informe de ${reportType} en formato ${format.toUpperCase()} generado con éxito.`
      );
    } catch (error) {
      console.error("Error al generar el informe:", error);
      AlertComponent.error("Error al generar el informe. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      if (value instanceof Date) return value.toLocaleDateString();
      if (Array.isArray(value)) return value.map(v => formatValue(v)).join(', ');
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p className="no-data-message">No hay datos disponibles.</p>;
    }

    if (activeTab === "projects") {
      return (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Presupuesto</th>
                <th>Evaluación Promedio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((project) => (
                <tr key={project._id}>
                  <td>{project.nombre}</td>
                  <td>{project.descripcion}</td>
                  <td>
                    <span className={`badge bg-${
                      project.estado === 'Finalizado' ? 'success' :
                      project.estado === 'Cancelado' ? 'danger' :
                      project.estado === 'En Proceso' ? 'warning' : 
                      project.estado === 'Planeado' ? 'info' : 'secondary'
                    }`}>
                      {project.estado}
                    </span>
                  </td>
                  <td>{formatValue(project.cronograma.fechaInicio)}</td>
                  <td>{formatValue(project.cronograma.fechaFin)}</td>
                  <td>${formatValue(project.presupuesto)}</td>
                  <td>
                    {project.evaluaciones && project.evaluaciones.length > 0
                      ? (project.evaluaciones.reduce((sum, ev) => sum + ev.puntuacion, 0) / project.evaluaciones.length).toFixed(2)
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="row">
          {data.map((evaluation) => (
            <div key={evaluation._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{evaluation.project?.nombre || 'Proyecto no disponible'}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {evaluation.evaluator?.nombre} {evaluation.evaluator?.apellido}
                  </h6>
                  <div className="d-flex align-items-center mb-2">
                    <FaStar className="text-warning me-2" />
                    <span>Puntuación: {evaluation.puntuacion.toFixed(1)}</span>
                  </div>
                  <p className="card-text">{evaluation.comentarios}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Fecha: {new Date(evaluation.fechaEvaluacion).toLocaleDateString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Panel de Informes Administrativos</h1>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => {setActiveTab("projects"); setCurrentPage(1); setSearchTerm("");}}
            >
              <FaProjectDiagram className="me-2" />
              Proyectos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "evaluations" ? "active" : ""}`}
              onClick={() => {setActiveTab("evaluations"); setCurrentPage(1); setSearchTerm("");}}
            >
              <FaStar className="me-2" />
              Evaluaciones
            </button>
          </li>
        </ul>

        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder={`Buscar ${activeTab === "projects" ? "proyectos" : "evaluaciones"}...`}
        />

        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <FaSpinner className="spinner-border" role="status" />
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              <h2>
                <FaChartBar className="me-2" />
                {activeTab === "projects" ? "Resumen de Proyectos" : "Resumen de Evaluaciones"}
              </h2>
              {renderTable(activeTab === "projects" ? projectsData : evaluationsData)}
              <div className="mt-4 d-flex justify-content-end">
                <button
                  onClick={() => generateReport("csv")}
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  <FaFileCsv className="me-2" />
                  {loading ? "Generando..." : "Descargar CSV"}
                </button>
                <button
                  onClick={() => generateReport("pdf")}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  <FaFilePdf className="me-2" />
                  {loading ? "Generando..." : "Descargar PDF"}
                </button>
              </div>
            </>
          )}
        </div>

        <AdmPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default AdmSeeReports