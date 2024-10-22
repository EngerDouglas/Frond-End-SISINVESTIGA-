import React, { useState, useEffect } from "react";
import { getData, putData } from "../../../services/apiServices";
import AlertComponent from "../../Common/AlertComponent";
import Modal from "../../Common/Modal";
import AdmEditInvestigator from "../../../views/Admin/InvestigatorViews/AdmEditInvestigator";
import "../../../css/Admin/AdmSeeInvestigator.css"
import profilenot from  '../../../assets/img/profile.png';

export default function AdmSeeInvestigator() {
  const [investigadores, setInvestigadores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
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
      console.log('Roles Data:', rolesData);
      setInvestigadores(usersData);
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
      await putData(`users/${id}`, action);
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
    setIsModalOpen(true);
  };

  const handleSave = async (updatedUser) => {
    try {
      const { _id, ...userDataToUpdate } = updatedUser;
      await putData('users', _id, userDataToUpdate);

      const updatedInvestigadores = investigadores.map((investigador) =>
        investigador._id === _id
          ? updatedUser
          : investigador
      );

      setInvestigadores(updatedInvestigadores);
      setIsModalOpen(false);
      AlertComponent.success("Usuario actualizado exitosamente.");
    } catch (error) {
      AlertComponent.error(
        "Error al actualizar el usuario. Por favor, intente de nuevo."
      );
    }
  };

  const handleUpdateRole = async (userId, roleId) => {
    try {
      await putData('users', `${userId}/role`, { roleId });
      const updatedInvestigadores = investigadores.map((investigador) =>
        investigador._id === userId
          ? { ...investigador, role: roles.find((role) => role._id === roleId) }
          : investigador
      );
      setInvestigadores(updatedInvestigadores);
      AlertComponent.success("Rol del usuario actualizado exitosamente.");
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      AlertComponent.error(
        "Error al actualizar el rol del usuario. Por favor, intente de nuevo."
      );
    }
  };

  const filteredInvestigadores = investigadores.filter((investigador) =>
    investigador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="investigadores-container">
      <h1 className="titulo">Investigadores</h1>
      <input
        type="text"
        className="form-control invest-search-bar"
        placeholder="Buscar investigador..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-striped table-hover investigadores-table">
          <thead className="thead-dark">
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Especialización</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Verificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestigadores.map((investigador) => (
              <tr key={investigador._id}>
                <td>
                  <img
                    src={investigador.fotoPerfil || profilenot}
                    alt={`Foto de ${investigador.nombre}`}
                    className="img-thumbnail investigador-foto"
                  />
                </td>
                <td>{investigador.nombre} {investigador.apellido}</td>
                <td>{investigador.especializacion}</td>
                <td>{investigador.role?.roleName || 'No asignado'}</td>
                <td>
                  {investigador.isDisabled ? "Deshabilitado" : "Habilitado"}
                </td>
                <td>{investigador.isVerified ? "Sí" : "No"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm invest-btn-modificar"
                    onClick={() => handleEdit(investigador)}
                  >
                    Modificar
                  </button>
                  <button
                    className={`btn btn-sm ${
                      investigador.isDisabled
                        ? "btn-success invest-btn-habilitar"
                        : "btn-danger invest-btn-deshabilitar"
                    }`}
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
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {editingUser && (
          <AdmEditInvestigator
            investigador={editingUser}
            roles={roles}
            onSave={handleSave}
            onUpdateRole={handleUpdateRole}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
