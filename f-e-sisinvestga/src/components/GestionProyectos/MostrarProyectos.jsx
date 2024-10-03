import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row, Modal, Form } from "react-bootstrap";
import { getData, putData } from "../../services/apiServices";
import '../../css/componentes/GestionProyectos/MostrarProyectos.css';

function MostrarProyectos() {
  const [proyectosData, setProyectoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: '',
    objetivos: '',
    presupuesto: '',
    cronograma: {
      fechaInicio: '',
      fechaFin: ''
    },
    hitos: [],
    recursos: [],
    estado: '',
  });
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectos = await getData("projects");
        setProyectoData(proyectos);
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
      // Envía los datos del nuevo proyecto al servidor
      const response = await putData("projects", newProject); 
      
      // Agregar el nuevo proyecto a la lista de proyectos
      setProyectoData((prevProyectos) => [...prevProyectos, response]); 
    } catch (error) {
      console.error("Error al crear el proyecto", error);
    }
  
    // Cerrar el modal y reiniciar el estado del nuevo proyecto
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
  

  const filteredProyectos = proyectosData.filter((proyecto) =>
    proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (proyecto) => {
    setSelectedProyecto(proyecto);
  };

  const handlePrintDetails = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Proyecto Detalles</title></head><body>');
    printWindow.document.write(`<h2>${selectedProyecto.nombre}</h2>`);
    printWindow.document.write(`<p><strong>Descripción:</strong> ${selectedProyecto.descripcion}</p>`);
    printWindow.document.write(`<p><strong>Objetivos:</strong> ${selectedProyecto.objetivos}</p>`);
    printWindow.document.write(`<p><strong>Presupuesto:</strong> ${selectedProyecto.presupuesto}</p>`);
    printWindow.document.write(`<p><strong>Fecha de Inicio:</strong> ${selectedProyecto.cronograma.fechaInicio}</p>`);
    printWindow.document.write(`<p><strong>Fecha de Fin:</strong> ${selectedProyecto.cronograma.fechaFin}</p>`);
    printWindow.document.write(`<p><strong>Estado:</strong> ${selectedProyecto.estado}</p>`);
    printWindow.document.write('<h3>Hitos:</h3>');
    selectedProyecto.hitos.forEach((hito) => {
      printWindow.document.write(`<p>${hito.nombre} - ${hito.fecha}</p>`);
    });
    printWindow.document.write('<h3>Recursos:</h3>');
    selectedProyecto.recursos.forEach((recurso) => {
      printWindow.document.write(`<p>${recurso}</p>`);
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

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
                  <strong>Objetivos:</strong> {proyecto.objetivos}<br />
                  <strong>Presupuesto:</strong> ${proyecto.presupuesto}<br />
                  <strong>Fecha de Inicio:</strong> {proyecto.cronograma.fechaInicio}<br />
                  <strong>Fecha Límite:</strong> {proyecto.cronograma.fechaFin}
                </Card.Text>
                <Button variant="success" className="w-100" onClick={() => handleViewDetails(proyecto)}>
                  Ver Detalles
                </Button>
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
                name="fechaInicio"
                value={newProject.cronograma.fechaInicio}
                onChange={(e) => setNewProject({ ...newProject, cronograma: { ...newProject.cronograma, fechaInicio: e.target.value } })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaLimite">
              <Form.Label>Fecha Límite</Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={newProject.cronograma.fechaFin}
                onChange={(e) => setNewProject({ ...newProject, cronograma: { ...newProject.cronograma, fechaFin: e.target.value } })}
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

      {/* Modal para ver detalles del proyecto */}
      {selectedProyecto && (
        <Modal show={true} onHide={() => setSelectedProyecto(null)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProyecto.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Descripción:</strong> {selectedProyecto.descripcion}</p>
            <p><strong>Objetivos:</strong> {selectedProyecto.objetivos}</p>
            <p><strong>Presupuesto:</strong> ${selectedProyecto.presupuesto}</p>
            <p><strong>Fecha de Inicio:</strong> {selectedProyecto.cronograma.fechaInicio}</p>
            <p><strong>Fecha de Fin:</strong> {selectedProyecto.cronograma.fechaFin}</p>
            <p><strong>Estado:</strong> {selectedProyecto.estado}</p>
            <h5>Hitos:</h5>
            {selectedProyecto.hitos.map((hito, index) => (
              <p key={index}>{hito.nombre} - {hito.fecha}</p>
            ))}
            <h5>Recursos:</h5>
            {selectedProyecto.recursos.map((recurso, index) => (
              <p key={index}>{recurso}</p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedProyecto(null)}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handlePrintDetails}>
              Imprimir Detalles
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default MostrarProyectos;
