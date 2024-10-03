import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../css/componentes/GestionProyectos/ProjectCard.css";

const ProjectCard = ({ project, onEdit, onDelete  }) => {
  return (
    <div className="project-card">
      <h3 className="project-title">{project.nombre}</h3>
      <p className="project-description">{project.descripcion}</p>
      <div className="project-info">
        <p>
          <strong>Presupuesto:</strong> ${project.presupuesto}
        </p>
        <p>
          <strong>Estado:</strong> {project.estado}
        </p>
      </div>
      <div className="project-actions">
        <button className="edit-btn" onClick={() => onEdit(project._id)}>
          <FaEdit /> Editar
        </button>
        <button className="delete-btn" onClick={() => onDelete(project._id)}>
          <FaTrash /> Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
