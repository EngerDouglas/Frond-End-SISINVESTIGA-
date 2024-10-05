import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaUser, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import Nav from "../../components/Comunes/Nav";
import { getDataById } from "../../services/apiServices";
import "../../css/componentes/GestionProyectos/ProjectDetails.css";
import InvestigatorModal from "../../components/GestionInvestigadores/InvestigatorModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // manejar el modal
  const [selectedInvestigator, setSelectedInvestigator] = useState(null);
  const [isInvestigatorModalOpen, setIsInvestigatorModalOpen] = useState(false);

  const handleInvestigatorClick = (investigador) => {
    setSelectedInvestigator(investigador);
    setIsInvestigatorModalOpen(true);
  };

  // Función para cerrar el modal
  const closeInvestigatorModal = () => {
    setIsInvestigatorModalOpen(false);
    setSelectedInvestigator(null);
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const data = await getDataById("projects", id);
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles del proyecto", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="project-details-loading">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <Nav />
        <div className="project-details-error">
          <p>No se pudo encontrar el proyecto.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="project-details-container">
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link> / <span>{project.nombre}</span>
        </nav>
        <h1 className="project-details-title">{project.nombre}</h1>
        <p className="project-details-description">{project.descripcion}</p>

        <div className="project-details-section">
          <h2>Información General</h2>
          <p>
            <strong>Estado:</strong> {project.estado}
          </p>
          <p>
            <FaCalendarAlt /> <strong>Fecha de Inicio:</strong>{" "}
            {format(new Date(project.cronograma.fechaInicio), "dd/MM/yyyy")}
          </p>
          <p>
            <FaDollarSign /> <strong>Presupuesto:</strong> $
            {project.presupuesto}
          </p>
        </div>

        <div className="project-details-section">
          <h2>Investigadores</h2>
          <ul>
            {project.investigadores.map((investigador) => (
              <li key={investigador._id}>
                <span
                  className="investigator-name"
                  onClick={() => handleInvestigatorClick(investigador)}
                >
                  <FaUser /> {investigador.nombre} {investigador.apellido}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="project-details-section">
          <h2>Recursos</h2>
          <ul>
            {project.recursos.map((recurso, index) => (
              <li key={index}>{recurso}</li>
            ))}
          </ul>
        </div>

        <div className="project-details-section">
          <h2>Hitos</h2>
          <ul>
            {project.hitos.map((hito, index) => (
              <li key={index}>
                <strong>{hito.nombre}</strong> - <FaCalendarAlt />{" "}
                {format(new Date(hito.fecha), "dd/MM/yyyy")}
                <br />
                <em>Entregable:</em> {hito.entregable}
              </li>
            ))}
          </ul>
        </div>

        {/* Si tienes evaluaciones, puedes mostrarlas aquí */}
        {project.evaluaciones && project.evaluaciones.length > 0 && (
          <div className="project-details-section">
            <h2>Evaluaciones</h2>
            <ul>
              {project.evaluaciones.map((evaluacion) => (
                <li key={evaluacion._id}>
                  <strong>Evaluador:</strong> {evaluacion.evaluator.nombre}{" "}
                  {evaluacion.evaluator.apellido}
                  <br />
                  <strong>Comentarios:</strong> {evaluacion.comentarios}
                  {/* Agrega más detalles de la evaluación si lo deseas */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isInvestigatorModalOpen && (
        <InvestigatorModal
          investigador={selectedInvestigator}
          onClose={closeInvestigatorModal}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
