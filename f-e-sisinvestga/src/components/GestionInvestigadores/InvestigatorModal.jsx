import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../css/componentes/GestionProyectos/InvestigatorModal.css';

const InvestigatorModal = ({ investigador, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="investigator-modal-overlay" onClick={handleOverlayClick}>
      <div className="investigator-modal">
        <button className="investigator-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="investigator-modal-content">
          <img
            src={investigador.fotoPerfil || 'https://via.placeholder.com/120'}
            alt={`${investigador.nombre} ${investigador.apellido}`}
            className="investigator-modal-photo"
          />
          <h2>
            {investigador.nombre} {investigador.apellido}
          </h2>
          <p>
            <strong>Especialización:</strong> {investigador.especializacion || 'No disponible'}
          </p>
          <p>
            <strong>Responsabilidades:</strong> {investigador.responsabilidades || 'No disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestigatorModal;
