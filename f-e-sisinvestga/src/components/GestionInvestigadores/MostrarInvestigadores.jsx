import React, { useState, useEffect } from "react";
import { getData, putData } from "../../services/apiServices";
import AlertComponent from "../Comunes/AlertComponent";
import Modal from "./Modal";
import "../../css/componentes/GestionInvestigadores/GestionInvestigadores.css";

export default function MostrarInvestigadores() {
  const [investigadores, setInvestigadores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        getData("users"),
        getData("roles"),
      ]);
      const investigadoresData = usersData.filter(
        (user) => user.role.roleName === "Investigador"
      );
      setInvestigadores(investigadoresData);
      setRoles(rolesData);
    } catch (error) {
      setError("Error al cargar los datos. Por favor, intente de nuevo.");
      AlertComponent.error(
        "Error al cargar los datos. Por favor, intente de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, isDisabled) => {
    try {
      const action = isDisabled ? "enable" : "disable";
      await putData(`users/${id}`, `${action}`);
      const updatedInvestigadores = investigadores.map((investigador) =>
        investigador._id === id
          ? { ...investigador, isDisabled: !isDisabled }
          : investigador
      );
      setInvestigadores(updatedInvestigadores);
      AlertComponent.success(
        `Usuario ${isDisabled ? "habilitado" : "deshabilitado"} exitosamente.`
      );
    } catch (error) {
      AlertComponent.error(
        "Error al cambiar el estado del usuario. Por favor, intente de nuevo."
      );
    }
  };

  const handleEdit = (investigador) => {
    setEditingUser(investigador);
    setNewRoleName(investigador.role.roleName);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingUser && newRoleName) {
      try {
        await putData('users', editingUser._id, { roleName: newRoleName });
        const updatedInvestigadores = investigadores.map((investigador) =>
          investigador._id === editingUser._id
            ? {
                ...investigador,
                role: { ...investigador.role, roleName: newRoleName },
              }
            : investigador
        );
        setInvestigadores(updatedInvestigadores);
        setIsModalOpen(false);
        AlertComponent.success("Rol actualizado exitosamente.");
      } catch (error) {
        AlertComponent.error(
          "Error al actualizar el rol. Por favor, intente de nuevo."
        );
      }
    }
  };

  const filteredInvestigadores = investigadores.filter((investigador) =>
    investigador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

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
            <th>Estado</th>
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
                {investigador.isDisabled ? "Deshabilitado" : "Habilitado"}
              </td>
              <td>
                <button
                  className="invest-btn-modificar"
                  onClick={() => handleEdit(investigador)}
                >
                  Modificar Rol
                </button>
                <button
                  className={
                    investigador.isDisabled
                      ? "invest-btn-habilitar"
                      : "invest-btn-deshabilitar"
                  }
                  onClick={() =>
                    handleToggleStatus(
                      investigador._id,
                      investigador.isDisabled
                    )
                  }
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
        {editingUser && (
          <>
            <p>
              <strong>Nombre:</strong> {editingUser.nombre}
            </p>
            <p>
              <strong>Especialización:</strong> {editingUser.especializacion}
            </p>
            <select
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="role-select"
            >
              {roles.map((role) => (
                <option key={role._id} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleSave} className="btn-save">
                Guardar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div> 
  );
}
