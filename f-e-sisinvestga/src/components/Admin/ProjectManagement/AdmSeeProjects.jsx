import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row, Modal, Form } from "react-bootstrap";
import { getData, putData } from "../../../services/apiServices";
import '../../../css/Admin/AdmSeeProjects.css';

function AdmSeeProjects() {
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
        setProyectoData(proyectos.projects || []);
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
                <Button variant="info" className="w-100" onClick={() => handleViewDetails(proyecto)}>
                  Ver Detalles
                </Button>
                <Button variant="danger" className="w-100" onClick={() => handleViewDetails(proyecto)}>
                  Eliminar
                </Button>
                <Button variant="secondary" className="w-100" onClick={() => handleViewDetails(proyecto)}>
                  Editar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

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

export default AdmSeeProjects;
