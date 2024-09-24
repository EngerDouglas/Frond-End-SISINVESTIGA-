import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Asegúrate de que la ruta sea correcta
import "../../css/componentes/GestionProyectos/Investigadores.css";
import Nav from "../Comunes/Nav";
import { getData, putData } from "../../services/apiServices";

function Investigadores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [investigadoresData, setInvestigadoresData] = useState([]);
  const [rolesData, setRolesData] = useState([]); // Para almacenar los roles desde la base de datos
  const [editingInvestigador, setEditingInvestigador] = useState(null);
  const [newRol, setNewRol] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargaremos los investigadores y roles al montarse el componente
  useEffect(() => {
    const fetchInvestigadoresYRoles = async () => {
      try {
        // Obtener investigadores desde la API
        const users = await getData("users");
        const investigadores = users.filter((user) => user.role.roleName === "Investigador");
        setInvestigadoresData(investigadores);

        // Obtener roles desde la API
        const roles = await getData("roles"); // Asegúrate de tener esta ruta en tu API
        setRolesData(roles);
      } catch (error) {
        console.error("Error al obtener investigadores y roles:", error);
      }
    };
    fetchInvestigadoresYRoles();
  }, []);

  const filteredInvestigadores = investigadoresData.filter((investigador) =>
    investigador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (investigador) => {
    setEditingInvestigador(investigador);
    setNewRol(investigador.role._id); // Prellenar el rol actual con el ID del rol
    setIsModalOpen(true); // Abrir la modal
  };

  const handleSave = async () => {
    if (editingInvestigador) {
      try {
        if (!newRol) {
          alert("Por favor selecciona un rol válido.");
          return;
        }

        // Actualizar el rol del investigador usando el ID del nuevo rol
        await putData(`users`, editingInvestigador._id, {
          role: newRol, // Enviar el ID del nuevo rol
        });

        alert(`Rol actualizado de ${editingInvestigador.nombre} correctamente`);

        // Actualizar el estado local con el nuevo rol
        const updatedInvestigadores = investigadoresData.map((investigador) =>
          investigador._id === editingInvestigador._id
            ? { ...investigador, role: { ...investigador.role, _id: newRol } }
            : investigador
        );
        setInvestigadoresData(updatedInvestigadores);

        // Cerrar el modal y limpiar el estado
        setEditingInvestigador(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al actualizar el rol del investigador:", error);
      }
    }
  };

  return (
    <>
      <Nav />
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
          {filteredInvestigadores.map((investigador) => (
            <li key={investigador._id} className="investigador-item">
              <strong>{investigador.nombre}</strong> - {investigador.role.roleName}
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
              <p>
                <strong>Nombre:</strong> {editingInvestigador.nombre}
              </p>
              <p>
                <strong>Especialización:</strong> {editingInvestigador.especializacion}
              </p>
              <select value={newRol} onChange={(e) => setNewRol(e.target.value)}>
                {rolesData.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
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
