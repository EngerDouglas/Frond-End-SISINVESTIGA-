import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaSearch, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getData, putData } from "../../../services/apiServices";
import AlertComponent from "../../Common/AlertComponent";
import Modal from "../../Common/Modal";
import AdmPagination from '../Common/AdmPagination';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    investigador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investigador.apellido.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Cálculos para la paginación
  const totalPages = Math.ceil(filteredInvestigadores.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvestigadores = filteredInvestigadores.slice(indexOfFirstItem, indexOfLastItem);

  // Reiniciar currentPage si excede totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Reiniciar currentPage cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-black">Gestión de Investigadores</h1>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaSearch /> Buscar investigador</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Table responsive hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Especialización</th>
                  <th>Correo Eletrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Verificado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentInvestigadores.map((investigador) => (
                  <tr key={investigador._id}>
                    <td>
                      <img
                        src={investigador.fotoPerfil || profilenot}
                        alt={`Foto de ${investigador.nombre}`}
                        className="rounded-circle"
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>{`${investigador.nombre} ${investigador.apellido}`}</td>
                    <td>{investigador.especializacion}</td>
                    <td>{investigador.email}</td>
                    <td>{investigador.role?.roleName || 'No asignado'}</td>
                    <td>
                      <Badge bg={investigador.isDisabled ? "danger" : "success"}>
                        {investigador.isDisabled ? "Deshabilitado" : "Habilitado"}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={investigador.isVerified ? "info" : "warning"}>
                        {investigador.isVerified ? "Verificado" : "No verificado"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(investigador)}
                      >
                        <FaEdit /> Editar
                      </Button>
                      <Button
                        variant={investigador.isDisabled ? "outline-success" : "outline-danger"}
                        size="sm"
                        onClick={() => handleToggleStatus(investigador._id, investigador.isDisabled)}
                      >
                        {investigador.isDisabled ? <FaToggleOn /> : <FaToggleOff />}
                        {' '}
                        {investigador.isDisabled ? "Habilitar" : "Deshabilitar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Componente de Paginación */}
            {totalPages > 1 && (
              <AdmPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </Card.Body>
        </Card>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Editar Investigador"
        >
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
      </Container>
    </>
  );
}
