import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { getDataById, putData, deleteData } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import AdmModalEvaluation from './AdmModalEvaluation';
import '../../../css/Admin/AdmEvaluationDetails.css';

const AdmEvaluationDetails = () => {
  const { projectId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);


  const fetchEvaluation = useCallback(async () => {
    try {
      const data = await getDataById('evaluations/projects/Admin', projectId);
      setEvaluations(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la evaluación. Por favor, intente de nuevo.');
      AlertComponent.error('Error al cargar la evaluación');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation])

  const handleEdit = (evaluation) => {
    setCurrentEvaluation(evaluation);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentEvaluation(null);
  };

  const handleUpdateEvaluation = (evaluationId, updatedData) => {
    const updatedEvaluations = evaluations.map(eva => 
      eva._id === evaluationId ? { ...eva, ...updatedData } : eva
    );
    setEvaluations(updatedEvaluations);
  };


  const handleDelete = async (evaluationId) => {
    const result = await AlertComponent.warning("¿Está seguro de que desea eliminar esta evaluación?");
    if (result.isConfirmed) {
      try {
        await deleteData('evaluations', evaluationId);
        AlertComponent.success("Evaluación eliminada con éxito");
        // Refresh evaluations after deletion
        const updatedEvaluations = evaluations.filter(eva => eva._id !== evaluationId);
        setEvaluations(updatedEvaluations);
        fetchEvaluation();
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

  const handleRestore = async (evaluationId) => {
    try {
      await putData(`evaluations/${evaluationId}`, 'restore');
      AlertComponent.success('Evaluación restaurada con éxito');
      const updatedEvaluations = evaluations.map(eva => 
        eva._id === evaluationId ? { ...eva, isDeleted: false } : eva
      );
      setEvaluations(updatedEvaluations);
    } catch (error) {
      AlertComponent.error('Error al restaurar la evaluación');
    }
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Container className="my-4">
      <h2 className="text-primary mb-4">Evaluaciones del Proyecto</h2>
      {evaluations.length === 0 ? (
        <Alert variant="info">No hay evaluaciones para este proyecto.</Alert>
      ) : (
        evaluations.map((evaluation) => (
          <Card key={evaluation._id} className="mb-4">
            <Card.Header as="h3" className="bg-primary text-white">
              Evaluación por {evaluation.evaluator.nombre} {evaluation.evaluator.apellido}
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Proyecto:</strong> {evaluation.project.nombre}</p>
                  <p><strong>Puntuación:</strong> {evaluation.puntuacion}</p>
                  <p><strong>Fecha de Evaluación:</strong> {new Date(evaluation.fechaEvaluacion).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Comentarios:</strong></p>
                  <p>{evaluation.comentarios}</p>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
              {!evaluation.isDeleted ? (
                <>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(evaluation)}>
                    <FaEdit /> Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(evaluation._id)}>
                    <FaTrash /> Eliminar
                  </Button>
                </>
              ) : (
                <Button variant="success" onClick={() => handleRestore(evaluation._id)}>
                  <FaUndo /> Restaurar
                </Button>
              )}
            </Card.Footer>
          </Card>
        ))
      )}
      <AdmModalEvaluation
        show={showEditModal}
        handleClose={handleCloseEditModal}
        evaluation={currentEvaluation}
        onUpdate={handleUpdateEvaluation}
      />
    </Container>
    </>
  );
}

export default AdmEvaluationDetails