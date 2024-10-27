import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { putData } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';

const AdmModalEvaluation = ({ show, handleClose, evaluation, onUpdate }) => {
  const [formData, setFormData] = useState({
    puntuacion: '',
    comentarios: ''
  });

  useEffect(() => {
    if (evaluation) {
      setFormData({
        puntuacion: evaluation.puntuacion || '',
        comentarios: evaluation.comentarios || ''
      });
    }
  }, [evaluation]);

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
        onUpdate(evaluation._id, formData);
        handleClose();
      } else {
        AlertComponent.error('No se pudo determinar la evaluación a actualizar.');
      }
    } catch (error) {
      AlertComponent.error('Error al actualizar la evaluación');
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Evaluación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AdmModalEvaluation