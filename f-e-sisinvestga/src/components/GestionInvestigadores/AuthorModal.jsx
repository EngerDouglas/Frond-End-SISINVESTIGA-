import React from 'react'
import { FaTimes } from 'react-icons/fa';
import '../../css/componentes/Publicaciones/AuthorModal.css'

const AuthorModal = ({ autor, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="author-modal-overlay" onClick={handleOverlayClick}>
      <div className="author-modal">
        <button className="author-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="author-modal-content">
          <img
            src={autor.fotoPerfil || 'https://via.placeholder.com/120'}
            alt={`${autor.nombre} ${autor.apellido}`}
            className="author-modal-photo"
          />
          <h2>
            {autor.nombre} {autor.apellido}
          </h2>
          <p>
            <strong>Especialización:</strong> {autor.especializacion || 'No disponible'}
          </p>
          <p>
            <strong>Responsabilidades:</strong> {autor.responsabilidades || 'No disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorModal