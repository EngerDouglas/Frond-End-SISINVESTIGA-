import React, { useState } from "react";
import { Card, Button, Col, Row, Modal, Form } from "react-bootstrap"; // Importar componentes de Bootstrap
import '../../css/componentes/GestionProyectos/MostrarProyectos.css';

const MostrarProyectos = () => {
  // Lista de proyectos de ejemplo
  const initialProyectos = [
    {
      titulo: 'Proyecto 1',
      objetivos: 'Objetivo 1',
      presupuesto: '1000',
      fechaInicio: '2024-01-01',
      fechaLimite: '2024-12-31'
    },
    {
      titulo: 'Proyecto 2',
      objetivos: 'Objetivo 2',
      presupuesto: '2000',
      fechaInicio: '2024-02-01',
      fechaLimite: '2024-11-30'
    }
  ];

  const [proyectos, setProyectos] = useState(initialProyectos);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    titulo: '',
    objetivos: '',
    presupuesto: '',
    fechaInicio: '',
    fechaLimite: ''
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleCreateProject = () => {
    setProyectos([...proyectos, newProject]);
    handleCloseModal();
    setNewProject({
      titulo: '',
      objetivos: '',
      presupuesto: '',
      fechaInicio: '',
      fechaLimite: ''
    });
  };

  const filteredProyectos = proyectos.filter((proyecto) =>
    proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="mostrarProyectos" className="container mt-5">
      <h2 className="text-center mb-4">Proyectos</h2>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button variant="success" className="mb-4" onClick={handleShowModal}>
        Crear Proyecto
      </Button>

      <Row xs={1} md={2} className="g-4">
        {filteredProyectos.map((proyecto, index) => (
          <Col key={index}>
            <Card className="project-card shadow-sm border-light">
              <Card.Body>
                <Card.Title className="project-title">{proyecto.titulo}</Card.Title>
                <Card.Text>
                  <strong>Objetivos:</strong> {proyecto.objetivos}<br />
                  <strong>Presupuesto:</strong> ${proyecto.presupuesto}<br />
                  <strong>Fecha de Inicio:</strong> {proyecto.fechaInicio}<br />
                  <strong>Fecha Límite:</strong> {proyecto.fechaLimite}
                </Card.Text>
                <Button variant="primary" className="w-100">Ver Detalles</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para crear un nuevo proyecto */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={newProject.titulo}
                onChange={handleInputChange}
                placeholder="Ingrese el título del proyecto"
              />
            </Form.Group>
            <Form.Group controlId="formObjetivos">
              <Form.Label>Objetivos</Form.Label>
              <Form.Control
                type="text"
                name="objetivos"
                value={newProject.objetivos}
                onChange={handleInputChange}
                placeholder="Ingrese los objetivos del proyecto"
              />
            </Form.Group>
            <Form.Group controlId="formPresupuesto">
              <Form.Label>Presupuesto</Form.Label>
              <Form.Control
                type="number"
                name="presupuesto"
                value={newProject.presupuesto}
                onChange={handleInputChange}
                placeholder="Ingrese el presupuesto del proyecto"
              />
            </Form.Group>
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={newProject.fechaInicio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFechaLimite">
              <Form.Label>Fecha Límite</Form.Label>
              <Form.Control
                type="date"
                name="fechaLimite"
                value={newProject.fechaLimite}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateProject}>
            Crear Proyecto
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MostrarProyectos;
