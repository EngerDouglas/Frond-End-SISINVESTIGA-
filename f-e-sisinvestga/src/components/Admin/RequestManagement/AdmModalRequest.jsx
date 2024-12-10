import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AlertComponent from '../../Common/AlertComponent';

const AdmModalRequest = ({ show, handleClose, request, onUpdate }) => {
  const [formData, setFormData] = useState({
    estado: '',
    comentarios: ''
  });

  useEffect(() => {
    if (request) {
      setFormData({
        estado: request.estado || '',
        comentarios: ''
      });
    }
  }, [request]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      handleClose();
    } catch (error) {
      AlertComponent.error('Error updating the request.');
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a status</option>
                <option value="Pendiente">Pending</option>
                <option value="Aprobada">Approved</option>
                <option value="Rechazada">Rejected</option>
                <option value="En Proceso">In Progress</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comentarios"
                value={formData.comentarios}
                onChange={handleInputChange}
                placeholder="Add a new comment (optional)"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AdmModalRequest