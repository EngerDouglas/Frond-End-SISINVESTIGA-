import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Table, Form, Button, Card, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUndo, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getData, postData, putData, deleteData, getDataParams } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import Pagination from '../../Common/Pagination';
import '../../../css/Admin/AdmSeeEvaluations.css';

const AdmSeeEvaluations = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    project: '',
    puntuacion: '',
    comentarios: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchEvaluations = useCallback(async () => {
    try {
      setLoading(true); 
      const response = await getDataParams('evaluations/all', { page: currentPage, limit: 10 });
      setEvaluations(response.evaluations);
      setTotalPages(response.totalPages);
    } catch (error) {
      AlertComponent.error('Error al cargar las evaluaciones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await getData('projects');
      setProjects(response.projects);
    } catch (error) {
      AlertComponent.error('Error al cargar los proyectos');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchEvaluations();
    fetchProjects();
  }, [fetchEvaluations, fetchProjects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await putData('evaluations' ,editingId, formData);
        AlertComponent.success('Evaluación actualizada con éxito');
      } else {
        await postData(`evaluations/projects/${formData.project}`, formData);
        AlertComponent.success('Evaluación creada con éxito');
      }
      setFormData({ project: '', puntuacion: '', comentarios: '' });
      setEditingId(null);
      fetchEvaluations();
    } catch (error) {
      AlertComponent.error('Error al guardar la evaluación');
      console.error(error);
    }
  };

  const handleEdit = (evaluation) => {
    setFormData({
      project: evaluation.project._id,
      puntuacion: evaluation.puntuacion,
      comentarios: evaluation.comentarios
    });
    setEditingId(evaluation._id);
  };

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("¿Está seguro de que desea eliminar esta evaluación?");
    if (result.isConfirmed) {
      try {
        await deleteData('evaluations', id);
        AlertComponent.success("Evaluación eliminada con éxito");
        fetchEvaluations();
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
    }
  };

  const handleRestore = async (id) => {
    try {
      await putData(`evaluations/${id}`, 'restore');
      AlertComponent.success('Evaluación restaurada con éxito');
      fetchEvaluations();
    } catch (error) {
      AlertComponent.error('Error al restaurar la evaluación');
      console.error(error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/evaluationprojects/${id}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <>
      <Container className="my-4">
      <h1 className="text-primary mb-4">Gestión de Evaluaciones</h1>
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Proyecto</Form.Label>
                  <Form.Select
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un proyecto</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
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
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Comentarios</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary">
              {editingId ? 'Actualizar Evaluación' : 'Crear Evaluación'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Evaluador</th>
            <th>Puntuación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map(evaluation => (
            <tr key={evaluation._id} className={evaluation.isDeleted ? 'table-danger' : ''}>
              <td>{evaluation.project.nombre}</td>
              <td>{`${evaluation.evaluator.nombre} ${evaluation.evaluator.apellido}`}</td>
              <td>{evaluation.puntuacion}</td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleViewDetails(evaluation.project._id)}>
                  <FaEye /> Ver
                </Button>
                {!evaluation.isDeleted ? (
                  <>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(evaluation)}>
                      <FaEdit /> Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(evaluation._id)}>
                      <FaTrash /> Eliminar
                    </Button>
                  </>
                ) : (
                  <Button variant="success" size="sm" onClick={() => handleRestore(evaluation._id)}>
                    <FaUndo /> Restaurar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </Container>
    </>
  );
};

export default AdmSeeEvaluations