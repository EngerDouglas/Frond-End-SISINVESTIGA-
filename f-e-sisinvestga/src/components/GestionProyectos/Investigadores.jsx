import React, { useState } from 'react';
import Modal from './Modal'; // Asegúrate de que la ruta sea correcta
import '../../css/componentes/GestionProyectos/Investigadores.css';
import Nav from '../Comunes/Nav';

const investigadoresData = [
    { id: 1, nombre: 'Juan Pérez', rol: 'Investigador Principal', especializacion: 'Biología' },
    { id: 2, nombre: 'María Gómez', rol: 'Co-investigador', especializacion: 'Química' },
    { id: 3, nombre: 'Luis Fernández', rol: 'Asistente de Investigación', especializacion: 'Física' },
];

const roles = [
    'Administrator',
    'Investigador',
    'Colaborador',
    'Asistente'
];

function Investigadores() {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [editingInvestigador, setEditingInvestigador] = useState(null);
    const [newRol, setNewRol] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredInvestigadores = investigadoresData.filter(investigador =>
        investigador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (investigador) => {
        setEditingInvestigador(investigador);
        setNewRol(investigador.rol); // Prellenar el rol actual
        setIsModalOpen(true); // Abrir la modal
    };

    const handleSave = () => {
        if (editingInvestigador) {
            alert(`Rol actualizado de ${editingInvestigador.nombre} a ${newRol}`);
            setEditingInvestigador(null); // Cerrar la ventana emergente
            setIsModalOpen(false); // Cerrar la modal
        }
    };

    return (
        <>
            <Nav></Nav>
             <div className="investigadores-container">
            <h1>Lista de Investigadores</h1>
            <input
                type="text"
                placeholder="Buscar por nombre..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="investigadores-list">
                {filteredInvestigadores.map(investigador => (
                    <li key={investigador.id} className="investigador-item">
                        <strong>{investigador.nombre}</strong> - {investigador.rol}
                        <button className="edit-button" onClick={() => handleEdit(investigador)}>
                            Editar Rol
                        </button>
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Editar Rol</h2>
                {editingInvestigador && (
                    <>
                        <p><strong>Nombre:</strong> {editingInvestigador.nombre}</p>
                        <p><strong>Especialización:</strong> {editingInvestigador.especializacion}</p>
                        <select
                            value={newRol}
                            onChange={(e) => setNewRol(e.target.value)}
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <button onClick={handleSave}>Guardar</button>
                    </>
                )}
                <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </Modal>
        </div>
        
        
        
        
        </>
       
    );
}

export default Investigadores;
