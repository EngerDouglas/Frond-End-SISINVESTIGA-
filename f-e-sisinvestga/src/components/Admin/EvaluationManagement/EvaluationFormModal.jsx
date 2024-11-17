import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { postData, putData } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';

const EvaluationFormModal = ({ show, handleClose, evaluation, project, refreshData }) => {
  const [formData, setFormData] = useState({
    project: project ? project._id : '',
    puntuacion: '',
    comentarios: '',
  });

  useEffect(() => {
    if (evaluation) {
      setFormData({
        project: evaluation.project._id,
        puntuacion: evaluation.puntuacion,
        comentarios: evaluation.comentarios,
      });
    } else if (project) {
      setFormData({
        project: project._id,
        puntuacion: '',
        comentarios: '',
      });
    } else {
      setFormData({
        project: '',
        puntuacion: '',
        comentarios: '',
      });
    }
  }, [evaluation, project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (evaluation && evaluation._id) {
        await putData('evaluations', evaluation._id, formData);
        AlertComponent.success('Evaluación actualizada con éxito');
      } else {
        await postData(`evaluations/projects/${formData.project}`, formData);
        AlertComponent.success('Evaluación creada con éxito');
      }
      handleClose();
      refreshData();
    } catch (error) {
      AlertComponent.error('Error al guardar la evaluación');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg"  centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{evaluation ? 'Editar Evaluación' : 'Crear Evaluación'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {project && (
          <div className="mb-4">
            <h5 className="text-primary">Detalles del Proyecto</h5>
            <Row>
              <Col md={6}>
                <p><strong>Nombre:</strong> {project.nombre}</p>
                <p><strong>Descripción:</strong> {project.descripcion}</p>
              </Col>
              <Col md={6}>
                <p><strong>Objetivos:</strong> {project.objetivos}</p>
                <p><strong>Presupuesto:</strong> ${project.presupuesto?.toLocaleString()}</p>
              </Col>
            </Row>
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Puntuación</Form.Label>
            <Form.Control
              type="number"
              name="puntuacion"
              value={formData.puntuacion}
              onChange={handleInputChange}
              required
              min="0"
              max="100"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comentarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comentarios"
              value={formData.comentarios}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {evaluation ? 'Guardar Cambios' : 'Crear Evaluación'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EvaluationFormModal;