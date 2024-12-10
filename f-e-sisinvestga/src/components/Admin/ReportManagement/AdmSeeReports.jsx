import React, { useState, useEffect, useCallback } from "react";
import { FaFileCsv, FaFilePdf, FaSpinner, FaChartBar, FaProjectDiagram, FaStar } from "react-icons/fa";
import AlertComponent from "../../Common/AlertComponent";
import { getDataParams, getFiles } from "../../../services/apiServices";
import AdmPagination from '../Common/AdmPagination';
import SearchBar from "../../Common/SearchBar";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../css/Admin/AdmReportView.css';

const AdmSeeReports = () => {
  const [loading, setLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([]);
  const [evaluationsData, setEvaluationsData] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  const [researcherOptions, setResearcherOptions] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedResearchers, setSelectedResearchers] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        selectedProjects: selectedProjects.map((p) => p.value).join(','),
        selectedResearchers: selectedResearchers.map((r) => r.value).join(','),
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
      };
  
      if (activeTab === "projects") {
        const data = await getDataParams("projects", params);
        if (data) {
          setProjectsData(data.projects);
          setTotalPages(data.totalPages);
        }
      } else {
        const data = await getDataParams("evaluations/all", params);
        if (data) {
          setEvaluationsData(data.evaluations);
          setTotalPages(data.totalPages);
        }
      }
    } catch (error) {
      AlertComponent.error(`Error loading the ${activeTab}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchTerm, selectedProjects, selectedResearchers, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [projectsResponse, researchersResponse] = await Promise.all([
          getDataParams('projects', { limit: 1000 }), 
          getDataParams('users'), 
        ]);

        if (projectsResponse.projects && Array.isArray(projectsResponse.projects)) {
          setProjectOptions(
            projectsResponse.projects.map((project) => ({
              value: project._id,
              label: project.nombre,
            }))
          );
        } else {
          AlertComponent.error('The project response does not have the expected format');
        }

        if (Array.isArray(researchersResponse)) {
          setResearcherOptions(
            researchersResponse.map((user) => ({
              value: user._id,
              label: `${user.nombre} ${user.apellido}`,
            }))
          );
        } else {
          AlertComponent.error('The user response does not have the expected format.');
        }

      } catch (error) {
        AlertComponent.error('Error loading filter options.');
      }
    };

    fetchOptions();
  }, []);

  const generateReport = async (format) => {
    setLoading(true);
    try {
      const reportType = activeTab === "projects" ? "projects" : "evaluations";

      const params = {
        search: searchTerm,
        selectedProjects: selectedProjects.map((p) => p.value).join(','),
        selectedResearchers: selectedResearchers.map((r) => r.value).join(','),
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await getFiles(`reports/admin/${reportType}/${format}?${queryString}`, {
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
        `${reportType} report in ${format.toUpperCase()} generated successfully.`
      );
    } catch (error) {
      AlertComponent.error("Error while generating the report. Please try again.");
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

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchData();
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) return value.map(v => formatValue(v)).join(', ');
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p className="no-data-message">There is no data available.</p>;
    }

    if (activeTab === "projects") {
      return (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>State</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Budget</th>
                <th>Average Rating</th>
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
                  <td>{new Date(project.cronograma.fechaInicio).toLocaleDateString()}</td>
                  <td>{new Date(project.cronograma.fechaFin).toLocaleDateString()}</td>
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
                    <span>Score: {evaluation.puntuacion.toFixed(1)}</span>
                  </div>
                  <p className="card-text">{evaluation.comentarios}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Date: {new Date(evaluation.fechaEvaluacion).toLocaleDateString()}
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
        <h1 className="text-center mb-4">Administrative Reports Panel</h1>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => { setActiveTab("projects"); setCurrentPage(1); setSearchTerm(""); fetchData(); }}
            >
              <FaProjectDiagram className="me-2" />
              Projects
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "evaluations" ? "active" : ""}`}
              onClick={() => { setActiveTab("evaluations"); setCurrentPage(1); setSearchTerm(""); fetchData(); }}
            >
              <FaStar className="me-2" />
              Evaluations
            </button>
          </li>
        </ul>

        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder={`Search ${activeTab === "projects" ? "projects" : "evaluations"}...`}
        />

        {/* Filters  */}
        <div className="filters mt-3">
          <div className="row">
            <div className="col-md-4">
              <label>Projects</label>
              <Select
                isMulti
                options={projectOptions}
                value={selectedProjects}
                onChange={(selected) => { setSelectedProjects(selected); handleFilterChange(); }}
                placeholder="Select projects"
              />
            </div>
            <div className="col-md-4">
              <label>Researchers</label>
              <Select
                isMulti
                options={researcherOptions}
                value={selectedResearchers}
                onChange={(selected) => { setSelectedResearchers(selected); handleFilterChange(); }}
                placeholder="Select researchers"
              />
            </div>
            <div className="col-md-2">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => { setStartDate(date); handleFilterChange(); }}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Start date"
              />
            </div>
            <div className="col-md-2">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => { setEndDate(date); handleFilterChange(); }}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="End Date"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <FaSpinner className="spinner-border" role="status" />
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              <h2>
                <FaChartBar className="me-2" />
                {activeTab === "projects" ? "Projects Summary" : "Evaluations Summary"}
              </h2>
              {renderTable(activeTab === "projects" ? projectsData : evaluationsData)}
              <div className="mt-4 d-flex justify-content-end">
                <button
                  onClick={() => generateReport("csv")}
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  <FaFileCsv className="me-2" />
                  {loading ? "Generating..." : "Download CSV"}
                </button>
                <button
                  onClick={() => generateReport("pdf")}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  <FaFilePdf className="me-2" />
                  {loading ? "Generating..." : "Download PDF"}
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