import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import '../../css/componentes/Publicaciones/PublicationCard.css'

const PublicationCard = ({ publication, onEdit, onDelete }) => {
  return (
    <div className='publication-card'>
      <h3 className='publication-title'>{publication.titulo}</h3>
      <p className='publication-summary'>{publication.resumen}</p>
      <div className='publication-info'>
        <p>
          <strong>Revista:</strong> {publication.revista}
        </p>
        <p>
          <strong>Tipo de Publicacion:</strong> {publication.tipoPublicacion}
        </p>
        <p>
          <strong>Estado:</strong> {publication.estado}
        </p>
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
  )
}

export default PublicationCard