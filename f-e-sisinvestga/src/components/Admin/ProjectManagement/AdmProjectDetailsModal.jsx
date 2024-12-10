import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FaPrint, FaTimes } from 'react-icons/fa';

const AdmProjectDetailsModal = ({ proyecto, handleClose, handlePrint }) => {
  return (
    <Modal show={true} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{proyecto.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Description:</strong> {proyecto.descripcion}</ListGroup.Item>
          <ListGroup.Item><strong>Objectives:</strong> {proyecto.objetivos}</ListGroup.Item>
          <ListGroup.Item><strong>Budget:</strong> ${proyecto.presupuesto?.toLocaleString()}</ListGroup.Item>
          <ListGroup.Item><strong>Start Date:</strong> {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>End Date:</strong> {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Status:</strong> {proyecto.estado}</ListGroup.Item>
        </ListGroup>
        <h5 className="mt-4">Milestones:</h5>
        {proyecto.hitos && proyecto.hitos.length > 0 ? (
          <ListGroup>
            {proyecto.hitos.map((hito, index) => (
              <ListGroup.Item key={index}>
                <strong>{hito.nombre}</strong> - {new Date(hito.fecha).toLocaleDateString()}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No milestones available.</p>
        )}
        <h5 className="mt-4">Resources:</h5>
        {proyecto.recursos && proyecto.recursos.length > 0 ? (
          <ListGroup>
            {proyecto.recursos.map((recurso, index) => (
              <ListGroup.Item key={index}>{recurso}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No resources available.</p>
        )}
        <h5 className="mt-4">Researchers:</h5>
        {proyecto.investigadores && proyecto.investigadores.length > 0 ? (
          <ListGroup>
            {proyecto.investigadores.map((investigador, index) => (
              <ListGroup.Item key={index}>{investigador.nombre} {investigador.apellido}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No researchers available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FaTimes /> Close
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          <FaPrint /> Print Details
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdmProjectDetailsModal;