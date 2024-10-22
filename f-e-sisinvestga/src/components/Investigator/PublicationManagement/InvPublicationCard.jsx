import React from 'react';
import { FaEdit, FaTrash, FaBook, FaFileAlt, FaGlobe } from 'react-icons/fa';
import '../../css/componentes/Publicaciones/PublicationCard.css';

const InvPublicationCard = ({ publication, onEdit, onDelete }) => {
  return (
    <div className='publication-card'>
      <div className="publication-card-header">
        <h3 className='publication-title'>{publication.titulo}</h3>
        <span className={`publication-status ${publication.estado.toLowerCase()}`}>{publication.estado}</span>
      </div>
      <p className='publication-summary'>{publication.resumen}</p>
      <div className='publication-info'>
        <div className="info-item">
          <FaBook className="info-icon" />
          <span>
            <strong>Revista:</strong> {publication.revista}
          </span>
        </div>
        <div className="info-item">
          <FaFileAlt className="info-icon" />
          <span>
            <strong>Tipo:</strong> {publication.tipoPublicacion}
          </span>
        </div>
        <div className="info-item">
          <FaGlobe className="info-icon" />
          <span>
            <strong>Idioma:</strong> {publication.idioma}
          </span>
        </div>
      </div>
      <div className='publication-actions'>
        <button className='publication-edit-btn' onClick={() => onEdit(publication._id)}>
          <FaEdit /> Editar
        </button>
        <button className='publication-delete-btn' onClick={() => onDelete(publication._id)}>
          <FaTrash /> Eliminar
        </button>
      </div>
    </div>
  );
};

export default InvPublicationCard;