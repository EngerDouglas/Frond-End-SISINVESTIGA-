import React from 'react';
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import AlertComponent from '../../Common/AlertComponent';
import { deleteData, putData } from '../../../services/apiServices';

const EvaluationCard = ({ evaluation, onEdit, refreshData }) => {
  const { project, puntuacion, comentarios, fechaEvaluacion, isDeleted } = evaluation;

  const handleDelete = async () => {
    const result = await AlertComponent.warning('¿Está seguro de que desea eliminar esta evaluación?');
    if (result.isConfirmed) {
      try {
        await deleteData('evaluations', evaluation._id);
        AlertComponent.success('Evaluación eliminada con éxito');
        refreshData();
      } catch (error) {
        AlertComponent.error('Error al eliminar la evaluación');
      }
    }
  };

  const handleRestore = async () => {
    try {
      await putData(`evaluations/${evaluation._id}`, 'restore');
      AlertComponent.success('Evaluación restaurada con éxito');
      refreshData();
    } catch (error) {
      AlertComponent.error('Error al restaurar la evaluación');
    }
  };

  return (
    <Card className={`evaluation-card h-100 ${isDeleted ? 'bg-light' : ''}`}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <strong>{project.nombre}</strong>
        <Badge bg={isDeleted ? 'secondary' : 'primary'} pill>
          {isDeleted ? 'Eliminada' : 'Activa'}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Card.Text><strong>Descripción del Proyecto:</strong> {project.descripcion}</Card.Text>
        <Card.Text><strong>Objetivos:</strong> {project.objetivos}</Card.Text>
        <Card.Text><strong>Presupuesto:</strong> ${project.presupuesto?.toLocaleString() || 'N/A'}</Card.Text>
        <Card.Text><strong>Cronograma:</strong></Card.Text>
        {project.cronograma ? (
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item><strong>Inicio:</strong> {new Date(project.cronograma.fechaInicio).toLocaleDateString()}</ListGroup.Item>
            <ListGroup.Item><strong>Fin:</strong> {new Date(project.cronograma.fechaFin).toLocaleDateString()}</ListGroup.Item>
          </ListGroup>
        ) : (
          <Card.Text>No hay cronograma disponible.</Card.Text>
        )}
        <Card.Text><strong>Investigadores:</strong></Card.Text>
        {project.investigadores && project.investigadores.length > 0 ? (
          <ListGroup variant="flush" className="mb-3">
            {project.investigadores.map((investigador) => (
              <ListGroup.Item key={investigador._id}>{investigador.nombre} {investigador.apellido}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Card.Text>No hay investigadores asignados.</Card.Text>
        )}
        <Card.Text><strong>Puntuación:</strong> {puntuacion}</Card.Text>
        <Card.Text><strong>Comentarios:</strong> {comentarios}</Card.Text>
        <Card.Text><strong>Evaluado:</strong> {new Date(fechaEvaluacion).toLocaleDateString()}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        {!isDeleted ? (
          <>
            <Button variant="outline-primary" className="me-2" onClick={() => onEdit(evaluation)}>
              <FaEdit /> Editar
            </Button>
            <Button variant="outline-danger" onClick={handleDelete}>
              <FaTrash /> Eliminar
            </Button>
          </>
        ) : (
          <Button variant="outline-success" onClick={handleRestore}>
            <FaUndo /> Restaurar
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default EvaluationCard;