import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const AdmPublicationForm = ({ publication, isEditing, handleInputChange, proyectos }) => {
  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={publication.titulo}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Publication Type</Form.Label>
            <Form.Control
              as="select"
              name="tipoPublicacion"
              value={publication.tipoPublicacion}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Articulo">Article</option>
              <option value="Informe">Report</option>
              <option value="Tesis">Thesis</option>
              <option value="Presentacion">Presentation</option>
              <option value="Otro">Other</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={publication.fecha ? publication.fecha.split('T')[0] : ''}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="estado"
              value={publication.estado}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="Borrador">Draft</option>
              <option value="Revisado">Reviewed</option>
              <option value="Publicado">Published</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Summary</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="resumen"
          value={publication.resumen}
          onChange={handleInputChange}
          readOnly={!isEditing}
        />
      </Form.Group>

      {/* Keywords  */}
      <Form.Group className="mb-3">
        <Form.Label>Keywords</Form.Label>
        <Form.Control
          type="text"
          name="palabrasClave"
          value={publication.palabrasClave.join(', ')}
          onChange={(e) => {
            const value = e.target.value.split(',').map((word) => word.trim());
            handleInputChange({
              target: {
                name: 'palabrasClave',
                value: value,
              },
            });
          }}
          readOnly={!isEditing}
        />
      </Form.Group>

      {/* Proyecto */}
      <Form.Group className="mb-3">
        <Form.Label>Project </Form.Label>
        {isEditing ? (
          <Form.Control
            as="select"
            name="proyecto"
            value={publication.proyecto?._id || ''}
            onChange={(e) => {
              const proyectoSeleccionado = proyectos.find((p) => p._id === e.target.value);
              handleInputChange({
                target: {
                  name: 'proyecto',
                  value: proyectoSeleccionado,
                },
              });
            }}
          >
            <option value="">Not assigned</option>
            {proyectos.map((proyecto) => (
              <option key={proyecto._id} value={proyecto._id}>
                {proyecto.nombre}
              </option>
            ))}
          </Form.Control>
        ) : (
          <Form.Control
            type="text"
            value={publication.proyecto ? publication.proyecto.nombre : 'Not assigned'}
            readOnly
          />
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Deletion Status</Form.Label>
        <Form.Control
          type="text"
          value={publication.isDeleted ? 'Deleted' : 'Active'}
          readOnly
        />
      </Form.Group>
    </Form>
  );
}

export default AdmPublicationForm