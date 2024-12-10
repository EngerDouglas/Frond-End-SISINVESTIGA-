import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Table, Card, Button, Form, Modal, Alert, Spinner, Badge
} from 'react-bootstrap';
import {
  FaPlus, FaEdit, FaTrash, FaUndo, FaSearch
} from 'react-icons/fa';
import {
  getData, postData, putData, deleteData
} from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import '../../../css/Admin/AdmSeeRole.css';
import AdmPagination from '../Common/AdmPagination';

const AdmSeeRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ roleName: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getData('roles');
      setRoles(response);
      setError(null);
    } catch (err) {
      setError('Error loading the roles. Please try again.');
      AlertComponent.error('Error loading the roles');
    }
    setLoading(false);
  };

  const handleShowModal = (mode, role = null) => {
    setModalMode(mode);
    setSelectedRole(role);
    setRoleForm(role ? { roleName: role.roleName } : { roleName: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setRoleForm({ roleName: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await postData('roles', roleForm);
        AlertComponent.success('Successfully created role');
      } else {
        await putData('roles', selectedRole._id, roleForm);
        AlertComponent.success('Successfully updated role');
      }
      handleCloseModal();
      fetchRoles();
    } catch (err) {
      AlertComponent.error(`Error to ${modalMode === 'create' ? 'create' : 'update'} the role`);
    }
  };

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("Are you sure you want to delete this role?");
    if (result.isConfirmed) {
      try {
        await deleteData("roles", id);
        AlertComponent.success("Successfully eliminated role");
        fetchRoles();
      } catch (error) {
        let errorMessage = "An error occurred during the deletion of the registry.";
        let detailedErrors = [];

        try {
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.message;
          detailedErrors = parsedError.errors || [];
        } catch (parseError) {
          errorMessage = error.message;
        }
        AlertComponent.error(errorMessage);
        detailedErrors.forEach((err) => AlertComponent.error(err));
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await putData(`roles/${id}`, 'restore');
      AlertComponent.success('Successfully restored role');
      fetchRoles();
    } catch (err) {
      AlertComponent.error('Failed to restore the role');
    }
  };

  // Filtrar roles según el término de búsqueda
  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  // Reiniciar currentPage si excede totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Container fluid className="mt-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h1 className="titulo-roles">Role Management</h1>
          </Col>
          <Col xs="auto">
            <Button variant="outline-primary" onClick={() => handleShowModal('create')}>
              <FaPlus /> New Role
            </Button>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="searchRole">
                  <Form.Label><FaSearch /> Search Role</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); 
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.map((role) => (
                  <tr key={role._id} className={role.isDeleted ? 'table-danger' : ''}>
                    <td>{role.roleName}</td>
                    <td>
                      <Badge bg={role.isDeleted ? 'danger' : 'success'}>
                        {role.isDeleted ? 'Inactive' : 'Active'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleShowModal('update', role)}
                        className="me-2"
                      >
                        <FaEdit /> Edit
                      </Button>
                      {role.isDeleted ? (
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleRestore(role._id)}
                        >
                          <FaUndo /> Restore
                        </Button>
                      ) : (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(role._id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      )}
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

        {/* Modal para Crear/Editar Rol */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{modalMode === 'create' ? 'Create New Role' : 'Edit Role'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  name="roleName"
                  value={roleForm.roleName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="outline-primary" type="submit">
                {modalMode === 'create' ? 'Create' : 'Update'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default AdmSeeRole;
