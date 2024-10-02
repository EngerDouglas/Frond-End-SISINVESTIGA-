import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row, Modal, Form } from "react-bootstrap"; 
import { getData, putData } from "../../services/apiServices";
import '../../css/componentes/GestionProyectos/MostrarProyectos.css';

function MostrarProyectos() {
  const [proyectosData, setProyectosData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: '',
    objetivos: '',
    presupuesto: 0,
    cronograma: {
      fechaInicio: '',
      fechaFin: ''
    },
    investigadores: [],
    recursos: [], // Cambiado para incluir PDFs
    hitos: [],
    estado: ''
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectos = await getData("projects");
        setProyectosData(proyectos);
      } catch (error) {
        console.error("Error al obtener los proyectos", error);
      }
    };
    fetchProyectos();
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleCreateProject = async () => {
    // Verificar si el nombre del proyecto ya existe
    const proyectoExistente = proyectosData.some(
      (proyecto) => proyecto.nombre.toLowerCase() === newProject.nombre.toLowerCase()
    );
    
    if (proyectoExistente) {
      alert('Ya existe un proyecto con este nombre.');
      return; // Detener la creación si el nombre ya existe
    }
  
    try {
      const response = await putData("projects", newProject); 
      setProyectosData([...proyectosData, response]); 
    } catch (error) {
      console.error("Error al crear el proyecto", error);
    }
    handleCloseModal();
    setNewProject({
      nombre: '',
      descripcion: '',
      objetivos: '',
      presupuesto: 0,
      cronograma: {
        fechaInicio: '',
        fechaFin: ''
      },
      investigadores: [],
      recursos: [],
      hitos: [],
      estado: ''
    });
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map(file => URL.createObjectURL(file));
    setNewProject({ ...newProject, recursos: fileURLs }); // Almacena las URLs de los archivos
  };

  const filteredProyectos = proyectosData.filter((proyecto) =>
    proyecto.nombre && proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Card.Title className="project-title">{proyecto.nombre}</Card.Title>
                <Card.Text>
                  <strong>Descripción:</strong> {proyecto.descripcion}<br />
                  <strong>Objetivos:</strong> {proyecto.objetivos}<br />
                  <strong>Presupuesto:</strong> ${proyecto.presupuesto}<br />
                  <strong>Fecha de Inicio:</strong> {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()}<br />
                  <strong>Fecha Límite:</strong> {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}<br />
                  <strong>Recursos:</strong>
                  {proyecto.recursos && proyecto.recursos.length > 0 ? (
                    <ul>
                      {proyecto.recursos.map((recurso, index) => (
                        <li key={index}>
                          <a href={recurso} target="_blank" rel="noopener noreferrer">Ver PDF {index + 1}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay recursos disponibles.</p>
                  )}
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
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newProject.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre del proyecto"
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={newProject.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción del proyecto"
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
                name="cronograma.fechaInicio"
                value={newProject.cronograma.fechaInicio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFechaFin">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                name="cronograma.fechaFin"
                value={newProject.cronograma.fechaFin}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRecursos">
              <Form.Label>Recursos (PDF)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                Cargar uno o más archivos PDF.
              </Form.Text>
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
}

export default MostrarProyectos;
