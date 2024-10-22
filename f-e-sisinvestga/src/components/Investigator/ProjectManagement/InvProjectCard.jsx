import React from "react";
import { FaEdit, FaTrash, FaCalendar, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import "../../../css/Investigator/ProjectCard.css";

const InvProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">{project.nombre}</h3>
        <span className={`project-status ${project.estado.toLowerCase().replace(/\s+/g, '-')}`}>{project.estado}</span>
      </div>
      <p className="project-description">{project.descripcion}</p>
      <div className="project-info">
        <div className="info-item">
          <FaMoneyBillWave className="info-icon" />
          <span>
            <strong>Presupuesto:</strong> ${project.presupuesto.toLocaleString()}
          </span>
        </div>
        <div className="info-item">
          <FaCalendar className="info-icon" />
          <span>
            <strong>Inicio:</strong> {new Date(project.cronograma.fechaInicio).toLocaleDateString()}
          </span>
        </div>
        <div className="info-item">
          <FaChartLine className="info-icon" />
          <span>
            <strong>Progreso:</strong> {project.progreso || '0'}%
          </span>
        </div>
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

export default InvProjectCard;