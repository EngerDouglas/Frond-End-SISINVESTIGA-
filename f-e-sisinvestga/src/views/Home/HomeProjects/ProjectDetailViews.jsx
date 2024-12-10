import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FaUser,
  FaCalendarAlt,
  FaDollarSign,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import Nav from "../../../components/Home/Common/Nav";
import { getDataById } from "../../../services/apiServices";
import "../../../css/Home/ProjectDetails.css";
import InvestigatorModal from "../../../components/Home/InvestigatorModal";

const ProjectDetailViews = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvestigator, setSelectedInvestigator] = useState(null);
  const [isInvestigatorModalOpen, setIsInvestigatorModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const data = await getDataById("projects", id);
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleInvestigatorClick = (investigador) => {
    setSelectedInvestigator(investigador);
    setIsInvestigatorModalOpen(true);
  };

  const closeInvestigatorModal = () => {
    setIsInvestigatorModalOpen(false);
    setSelectedInvestigator(null);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="project-details__loading">
          <div className="project-details__spinner"></div>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <Nav />
        <div className="project-details__error">
          <p>The project could not be found.</p>
          <Link to="/" className="project-details__back-link">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="project-details">
        <div className="project-details__container">
          <nav className="project-details__breadcrumb">
            <Link to="/">Home</Link> <FaChevronRight /> <span>{project.nombre}</span>
          </nav>
          <h1 className="project-details__title">{project.nombre}</h1>
          <p className="project-details__description">{project.descripcion}</p>

          <div className="project-details__section">
            <h2
              onClick={() => toggleSection("info")}
              className="project-details__section-title"
            >
              General Information{" "}
              {expandedSections.info ? <FaChevronDown /> : <FaChevronRight />}
            </h2>
            {expandedSections.info && (
              <div className="project-details__section-content">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`project-details__status project-details__status--${project.estado.toLowerCase()}`}
                  >
                    {project.estado}
                  </span>
                </p>
                <p>
                  <FaCalendarAlt /> <strong>Start Date:</strong>{" "}
                  {format(
                    new Date(project.cronograma.fechaInicio),
                    "MM/dd/yyyy"
                  )}
                </p>
                <p>
                  <FaDollarSign /> <strong>Budget:</strong> $
                  {project.presupuesto.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="project-details__section">
            <h2
              onClick={() => toggleSection("investigators")}
              className="project-details__section-title"
            >
              Investigators{" "}
              {expandedSections.investigators ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.investigators && (
              <ul className="project-details__investigators-list">
                {project.investigadores.map((investigador) => (
                  <li
                    key={investigador._id}
                    className="project-details__investigator-item"
                  >
                    <button
                      onClick={() => handleInvestigatorClick(investigador)}
                      className="project-details__investigator-button"
                    >
                      <FaUser /> {investigador.nombre} {investigador.apellido}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="project-details__section">
            <h2
              onClick={() => toggleSection("resources")}
              className="project-details__section-title"
            >
              Resources{" "}
              {expandedSections.resources ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.resources && (
              <ul className="project-details__resources-list">
                {project.recursos.map((recurso, index) => (
                  <li key={index} className="project-details__resource-item">
                    {recurso}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="project-details__section">
            <h2
              onClick={() => toggleSection("milestones")}
              className="project-details__section-title"
            >
              Milestones{" "}
              {expandedSections.milestones ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </h2>
            {expandedSections.milestones && (
              <ul className="project-details__milestones-list">
                {project.hitos.map((hito, index) => (
                  <li key={index} className="project-details__milestone-item">
                    <strong>{hito.nombre}</strong> - <FaCalendarAlt />{" "}
                    {format(new Date(hito.fecha), "MM/dd/yyyy")}
                    <br />
                    <em>Deliverable:</em> {hito.entregable}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {project.evaluaciones && project.evaluaciones.length > 0 && (
            <div className="project-details__section">
              <h2
                onClick={() => toggleSection("evaluations")}
                className="project-details__section-title"
              >
                Evaluations{" "}
                {expandedSections.evaluations ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </h2>
              {expandedSections.evaluations && (
                <ul className="project-details__evaluations-list">
                  {project.evaluaciones.map((evaluacion) => (
                    <li
                      key={evaluacion._id}
                      className="project-details__evaluation-item"
                    >
                      <strong>Evaluator:</strong> {evaluacion.evaluator.nombre}{" "}
                      {evaluacion.evaluator.apellido}
                      <br />
                      <strong>Comments:</strong> {evaluacion.comentarios}
                      <br />
                      <strong>Score:</strong> {evaluacion.puntuacion}
                    </li>
                  ))}
                </ul>
              )}
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
    </>
  );
};

export default ProjectDetailViews;
