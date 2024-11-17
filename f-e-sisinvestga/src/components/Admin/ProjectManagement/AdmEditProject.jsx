import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, ProgressBar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FaTrash, FaPlus, FaSave, FaUpload } from 'react-icons/fa';
import { getDataById, putData } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../css/Admin/AdmEditProject.css';

const AdmEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    objetivos: '',
    presupuesto: 0,
    estado: 'Planeado',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    hitos: [{ nombre: '', fecha: new Date() }],
    recursos: [''],
    imagen: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getDataById('projects', id);
        if (project) {
          setFormData({
            nombre: project.nombre || '',
            descripcion: project.descripcion || '',
            objetivos: project.objetivos || '',
            presupuesto: project.presupuesto || 0,
            estado: project.estado || 'Planeado',
            fechaInicio: project.cronograma ? new Date(project.cronograma.fechaInicio) : new Date(),
            fechaFin: project.cronograma ? new Date(project.cronograma.fechaFin) : new Date(),
            hitos: Array.isArray(project.hitos) && project.hitos.length > 0
              ? project.hitos.map(h => ({ ...h, fecha: new Date(h.fecha) }))
              : [{ nombre: '', fecha: new Date() }],
            recursos: Array.isArray(project.recursos) && project.recursos.length > 0
              ? project.recursos
              : [''],
            imagen: project.imagen || '',
          });
          setPreviewImage(project.imagen || null);
        }
      } catch (error) {
        console.error(error);
        AlertComponent.error('Error al cargar los datos del proyecto');
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (name, date) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: date,
    }));
  };

  const addHito = () => {
    setFormData(prevData => ({
      ...prevData,
      hitos: [...prevData.hitos, { nombre: '', fecha: new Date() }],
    }));
  };

  const removeHito = (index) => {
    setFormData(prevData => ({
      ...prevData,
      hitos: prevData.hitos.filter((_, i) => i !== index),
    }));
  };

  const handleHitoChange = (index, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      hitos: prevData.hitos.map((hito, i) =>
        i === index ? { ...hito, [field]: value } : hito
      ),
    }));
  };

  const addRecurso = () => {
    setFormData(prevData => ({
      ...prevData,
      recursos: [...prevData.recursos, ''],
    }));
  };

  const removeRecurso = (index) => {
    setFormData(prevData => ({
      ...prevData,
      recursos: prevData.recursos.filter((_, i) => i !== index),
    }));
  };

  const handleRecursoChange = (index, value) => {
    setFormData(prevData => ({
      ...prevData,
      recursos: prevData.recursos.map((recurso, i) =>
        i === index ? value : recurso
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = new FormData();

    updatedProject.append('nombre', formData.nombre);
    updatedProject.append('descripcion', formData.descripcion);
    updatedProject.append('objetivos', formData.objetivos);
    updatedProject.append('presupuesto', formData.presupuesto);
    updatedProject.append('estado', formData.estado);

    updatedProject.append('cronograma[fechaInicio]', formData.fechaInicio.toISOString());
    updatedProject.append('cronograma[fechaFin]', formData.fechaFin.toISOString());

    formData.hitos.forEach((hito, index) => {
      updatedProject.append(`hitos[${index}][nombre]`, hito.nombre);
      updatedProject.append(`hitos[${index}][fecha]`, hito.fecha.toISOString());
    });

    formData.recursos.forEach((recurso, index) => {
      updatedProject.append(`recursos[${index}]`, recurso);
    });

    if (selectedFile) {
      updatedProject.append('imagen', selectedFile);
    }

    try {
      await putData("projects", id, updatedProject);
      AlertComponent.success("Proyecto actualizado exitosamente.");
      navigate('/admin/listarproyectos');
    } catch (error) {
      handleError(error, "Ocurrió un error al actualizar el Proyecto.");
    }
  };

  const handleError = (error, defaultMessage) => {
    let errorMessage = defaultMessage;
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
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Objetivos</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
              />
            </Form.Group>
          </>
        );
      case 2:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Presupuesto</Form.Label>
              <Form.Control
                type="number"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado del Proyecto</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
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
                    selected={formData.fechaInicio}
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
                    selected={formData.fechaFin}
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
      case 3:
        return (
          <>
            <Card className="mb-3">
              <Card.Header>Hitos</Card.Header>
              <Card.Body>
                {formData.hitos.map((hito, index) => (
                  <Row key={index} className="mb-3">
                    <Col xs={12} md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Nombre del hito"
                        value={hito.nombre}
                        onChange={(e) => handleHitoChange(index, "nombre", e.target.value)}
                        required
                      />
                    </Col>
                    <Col xs={10} md={5}>
                      <DatePicker
                        selected={hito.fecha}
                        onChange={(date) => handleHitoChange(index, "fecha", date)}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        required
                      />
                    </Col>
                    <Col xs={2} md={1}>
                      <Button variant="danger" onClick={() => removeHito(index)}>
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="success" onClick={addHito}>
                  <FaPlus /> Añadir Hito
                </Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>Recursos</Card.Header>
              <Card.Body>
                {formData.recursos.map((recurso, index) => (
                  <Row key={index} className="mb-3">
                    <Col xs={10}>
                      <Form.Control
                        type="text"
                        placeholder="Recurso"
                        value={recurso}
                        onChange={(e) => handleRecursoChange(index, e.target.value)}
                        required
                      />
                    </Col>
                    <Col xs={2}>
                      <Button variant="danger" onClick={() => removeRecurso(index)}>
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="success" onClick={addRecurso}>
                  <FaPlus /> Añadir Recurso
                </Button>
              </Card.Body>
            </Card>
          </>
        );
      case 4:
        return (
          <Form.Group className="mb-3">
            <Form.Label>Imagen del Proyecto</Form.Label>
            <div className="d-flex align-items-center mb-3">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="d-none"
                id="project-image"
              />
              <Button as="label" htmlFor="project-image" variant="outline-primary">
                <FaUpload /> Seleccionar Imagen
              </Button>
              {selectedFile && <span className="ml-3">{selectedFile.name}</span>}
            </div>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Vista previa" className="img-fluid" />
              </div>
            )}
          </Form.Group>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="my-5 adm-edit-project">
      <h1 className="text-center mb-4">Editar Proyecto</h1>
      <Card>
        <Card.Body>
          <ProgressBar now={(currentStep / 4) * 100} className="mb-4" />
          <Form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="d-flex justify-content-between mt-4">
              {currentStep > 1 && (
                <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} type="button">
                  Anterior
                </Button>
              )}
              {currentStep < 4 && (
                <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)} type="button">
                  Siguiente
                </Button>
              )}
              {currentStep === 4 && (
                <Button variant="success" type="submit">
                  <FaSave /> Guardar Cambios
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdmEditProject;