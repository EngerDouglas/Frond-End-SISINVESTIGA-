import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row, Modal } from "react-bootstrap";
import { getData, deleteData } from "../../../services/apiServices";
import AlertComponent from "../../../components/Common/AlertComponent";
import AlertRestaurar from "../../Admin/Common/AlertRestaurar";
import '../../../css/Admin/AdmSeeProjects.css';
import { useNavigate } from "react-router";

export default function AdmSeeProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("Todos");
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const navigate = useNavigate();

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

  const estados = ["Todos", "Finalizado", "Planeado", "Eliminado"];

  const filteredProyectos = proyectosData.filter((proyecto) => {
    const matchesSearch = proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoSeleccionado === "Todos" || proyecto.estado === estadoSeleccionado;
    return matchesSearch && matchesEstado;
  });

  const handleViewDetails = (proyecto) => {
    setSelectedProyecto(proyecto);
  };

  const handleEditProject = (projectId) => {
    navigate(`/invest/proyectos/editar/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const result = await AlertComponent.warning(
        "¿Estás seguro que deseas eliminar este proyecto?"
      );
      if (result.isConfirmed) {
        await deleteData("projects", projectId);
        AlertComponent.success("El proyecto ha sido eliminado correctamente.");
        setProyectoData(proyectosData.filter((project) => project._id !== projectId));
      }
    } catch (error) {
      let errorMessage = "Ocurrió un error durante la eliminación del registro.";
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

  const handleRestoreProject = async (proyecto) => {
    try {
      const result = await AlertRestaurar.warning(
        "¿Estás seguro que deseas restaurar este proyecto?"
      );
      if (result.isConfirmed) {
        const projectId = proyecto._id.toString();
        // Assuming there's an API endpoint to restore projects
        await getData(`/restore/${projectId}`);
        AlertRestaurar.success("El proyecto ha sido restaurado correctamente.");
        // Update the project's state to its previous state (you might want to store the previous state when deleting)
        setProyectoData(proyectosData.map(p => 
          p._id === proyecto._id ? { ...p, estado: "Planeado" } : p
        ));
      }
    } catch (error) {
      AlertRestaurar.error("Ocurrió un error al restaurar el proyecto.");
    }
  };

  return (
    <div id="mostrarProyectos" className="container mt-5">
      <h2 className="text-center mb-4">Proyectos</h2>

      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="input-group">
              <input
                type="text"
                placeholder="Buscar proyecto..."
                className="form-control flex-grow-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select flex-grow-0 w-auto"
                value={estadoSeleccionado}
                onChange={(e) => setEstadoSeleccionado(e.target.value)}
              >
                {estados.map((estado, index) => (
                  <option key={index} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
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
                  <strong>Fecha Límite:</strong> {proyecto.cronograma.fechaFin}<br />
                  <strong>Estado:</strong> {proyecto.estado}
                </Card.Text>
            
                {proyecto.estado === "Eliminado" ? (
                  <Button variant="success" className="w-100" onClick={() => handleRestoreProject(proyecto)}>
                    Restaurar
                  </Button>
                ) : (
                  <>
                    <Button variant="info" className="w-100 btn-success" onClick={() => handleViewDetails(proyecto)}>
                      Ver Detalles
                    </Button>
                    <Button variant="danger" className="w-100 btn-success" onClick={() => handleDeleteProject(proyecto)}>
                      Eliminar
                    </Button>
                    <Button variant="secondary" className="w-100 btn-success" onClick={() => handleEditProject(proyecto._id)}>
                      Editar
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

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