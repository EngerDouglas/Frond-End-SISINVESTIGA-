import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import NavInvestigator from "../../../components/Investigator/Common/NavInvestigator";
import AlertComponent from "../../../components/Common/AlertComponent";
import InvProjectCard from "./InvProjectCard";
import Pagination from "../../../components/Common/Pagination";
import SearchBar from "../../../components/Common/SearchBar";
import { getUserData, deleteData } from "../../../services/apiServices";
import "../../../css/Investigator/InvProjectView.css";

const InvSeeProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectViews = async () => {
      try {
        const data = await getUserData("projects", { page, limit: 6, search: searchTerm });
        if (data && data.data) {
          setProjects(data.data);
          setTotalPages(Math.ceil(data.total / data.limit));
        } else {
          setProjects([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los proyectos", error);
        setError("Error al cargar los proyectos");
        setLoading(false);
      }
    };

    fetchProjectViews();
  }, [page, searchTerm]);

  const handleAddProject = () => {
    navigate("/invest/proyectos/agregar");
  };

  const handleEditProject = (projectId) => {
    navigate(`/invest/proyectos/editar/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const result = await AlertComponent.warning(
        "¿Estás seguro que deseas eliminar este proyecto?"
      );
      if (result.isConfirmed) {
        await deleteData("projects", projectId);
        AlertComponent.success("El proyecto ha sido eliminado correctamente.");
        setProjects(projects.filter((project) => project._id !== projectId));
      }
    } catch (error) {
      let errorMessage = "Ocurrió un error durante la eliminación del registro.";
      let detailedErrors = [];

      try {
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.message;
        detailedErrors = parsedError.errors || [];
      } catch (parseError) {
        errorMessage = error.message;
      }
      AlertComponent.error(errorMessage);
      detailedErrors.forEach((err) => AlertComponent.error(err));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando Proyectos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <NavInvestigator />
      <div className="inv-project-view">
        <div className="project-header">
          <h1>Mis Proyectos</h1>
          <button className="add-project-btn" onClick={handleAddProject}>
            <FaPlus /> Agregar Proyecto
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar proyectos..."
        />

        <div className="projects-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <InvProjectCard
                key={project._id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))
          ) : (
            <p className="no-projects-message">No tienes proyectos aún. ¡Agrega uno nuevo!</p>
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onNext={() => setPage(page + 1)}
          onPrev={() => setPage(page - 1)}
          disabledPrev={page === 1}
          disabledNext={page === totalPages}
        />
      </div>
    </>
  );
};

export default InvSeeProject;