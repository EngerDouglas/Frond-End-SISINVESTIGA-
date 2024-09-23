import React from 'react';
import '../../css/componentes/GestionProyectos/Modal.css'

const EditarRol = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // No renderizar nada si la ventana no está abierta

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default EditarRol;
