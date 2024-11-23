import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

const Step2 = ({ formData, handleChange, handleDateChange }) => {
  const { presupuesto, estado, fechaInicio, fechaFin } = formData;

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Presupuesto</Form.Label>
        <Form.Control
          type="number"
          name="presupuesto"
          value={presupuesto}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Estado del Proyecto</Form.Label>
        <Form.Select
          name="estado"
          value={estado}
          onChange={handleChange}
          required
        >
          <option value="Planeado">Planeado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </Form.Select>
      </Form.Group>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Inicio</Form.Label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => handleDateChange("fechaInicio", date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Fin</Form.Label>
            <DatePicker
              selected={fechaFin}
              onChange={(date) => handleDateChange("fechaFin", date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              required
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default Step2;