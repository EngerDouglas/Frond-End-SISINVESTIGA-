import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import ProjectCard from "../../components/GestionProyectos/ProjectCard";
import Pagination from "../../components/Comunes/Pagination";
import { getUserData, deleteData } from "../../services/apiServices";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "../../css/componentes/GestionProyectos/InvProjectView.css";

const InvProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectViews = async () => {
      try {
        const data = await getUserData("projects", { page, limit: 6 });
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
  }, [page]);

  const handleAddProject = () => {
    navigate("/invest/proyectos/agregar"); // Redirigir a la página de agregar
  };

  const handleEditProject = (projectId) => {
    navigate(`/invest/proyectos/editar/${projectId}`); // Redirigir a la página de editar
  };

  const handleDeleteProject = async (projectId) => {
    try {
      AlertComponent.warning(
        "¿Estás seguro que deseas eliminar este proyecto?"
      ).then((result) => {
        if (result.isConfirmed) {
          deleteData("projects", projectId)
            .then(() => {
              AlertComponent.success(
                "El proyecto ha sido eliminado correctamente."
              );
              setProjects(
                projects.filter((project) => project._id !== projectId)
              );
            })
            .catch((error) => {
              let errorMessage = "Ocurrió un error durante la eliminacion del registro.";
              let detailedErrors = [];

              try {
                // Intentamos analizar el error recibido del backend
                const parsedError = JSON.parse(error.message);
                errorMessage = parsedError.message;
                detailedErrors = parsedError.errors || [];
              } catch (parseError) {
                // Si no se pudo analizar, usamos el mensaje de error general
                errorMessage = error.message;
              }
              AlertComponent.error(errorMessage);
              detailedErrors.forEach((err) => AlertComponent.error(err));
            });
        }
      });
    } catch (error) {
      console.error("Error al eliminar el proyecto", error);
    }
  };

  if (loading) {
    return <div>Cargando Proyectos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <NavInvestigator />
      <div className="inv-project-view">
        <h1>Mis Proyectos</h1>

        <button className="add-project-btn" onClick={handleAddProject}>
          <FaPlus /> Agregar Proyecto
        </button>

        <div className="projects-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))
          ) : (
            <p>No tienes proyectos aún. ¡Agrega uno nuevo!</p>
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

export default InvProjectView;
