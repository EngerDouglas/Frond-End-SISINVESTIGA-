import React, { useState, useEffect } from "react";
import { getData, putData } from "../../services/apiServices";
import "../../css/componentes/GestionInvestigadores/GestionInvestigadores.css";
import Modal from "./Modal"; // Asegúrate de que la ruta sea correcta

function MostrarInvestigadores() {
  const [investigadoresData, setInvestigadoresData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvestigador, setEditingInvestigador] = useState(null);
  const [newRol, setNewRol] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rolesData, setRolesData] = useState([]); // Para almacenar los roles desde la base de datos

  // Cargar los investigadores desde la API
  useEffect(() => {
    const fetchInvestigadores = async () => {
      try {
        const users = await getData("users");
        const investigadores = users.filter(user => user.role.roleName === "Investigador");
        setInvestigadoresData(investigadores);
         // Obtener roles desde la API
         const roles = await getData("roles"); // Asegúrate de tener esta ruta en tu API
         setRolesData(roles);
      } catch (error) {
        console.error("Error al obtener los investigadores:", error);
      }
    };
    fetchInvestigadores();
  }, []);

  const handleToggleStatus = async (id, isDisabled) => {
    try {
      // Aquí puedes cambiar el estado a habilitado o deshabilitado
      await putData(`users`, id, { isDisabled: !isDisabled });
      
      // Actualiza el estado local
      const updatedInvestigadores = investigadoresData.map((investigador) =>
        investigador._id === id
          ? { ...investigador, isDisabled: !isDisabled }
          : investigador
      );
      setInvestigadoresData(updatedInvestigadores);
    } catch (error) {
      console.error("Error al cambiar el estado del investigador:", error);
    }
  };

  const handleEdit = (investigador) => {
    setEditingInvestigador(investigador);
    setNewRol(investigador.role._id); // Prellenar el rol actual con el ID del rol
    setIsModalOpen(true); // Abrir la modal
  };


  const handleSave = async () => {
    if (editingInvestigador) {
      try {
        await putData(`users`, editingInvestigador._id, {
          role: newRol,
        });

        alert(`Rol actualizado de ${editingInvestigador.nombre} correctamente`);

        const updatedInvestigadores = investigadoresData.map((investigador) =>
          investigador._id === editingInvestigador._id
            ? { ...investigador, role: { ...investigador.role, _id: newRol } }
            : investigador
        );
        setInvestigadoresData(updatedInvestigadores);
        setEditingInvestigador(null);
      } catch (error) {
        console.error("Error al actualizar el rol del investigador:", error);
      }
    }
  };

  const filteredInvestigadores = investigadoresData.filter((investigador) =>
    investigador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="investigadores-container">
      <h1 className="titulo">Investigadores</h1>
      <input
        type="text"
        className="invest-search-bar"
        placeholder="Buscar investigador..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="investigadores-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialización</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvestigadores.map((investigador) => (
            <tr key={investigador._id}>
              <td>{investigador.nombre}</td>
              <td>{investigador.especializacion}</td>
              <td>{investigador.role.roleName}</td>
              <td>
                <button
                  className="invest-btn-modificar"
                  onClick={() => handleEdit(investigador)}
                >
                  Modificar
                </button>
                <button
                  className={investigador.isDisabled ? "invest-btn-deshabilitar" : "invest-btn-modificar"}
                  onClick={() => handleToggleStatus(investigador._id, investigador.isDisabled)}
                >
                  {investigador.isDisabled ? "Habilitar" : "Deshabilitar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
  );
}

export default MostrarInvestigadores;
