import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaInfoCircle, FaTrash, FaEdit, FaUndo } from 'react-icons/fa';
import AlertComponent from '../../Common/AlertComponent';
import { useNavigate } from 'react-router-dom';
import { deleteData, putData } from '../../../services/apiServices';

const AdmProjectCard = ({ proyecto, onViewDetails, fetchProjects }) => {
  const navigate = useNavigate();

  const handleEditProject = (id) => {
    navigate(`/adm/proyectos/editar/${id}`);
  };

  const handleDeleteProject = async () => {
    try {
      const result = await AlertComponent.warning(
        '¿Estás seguro que deseas eliminar este proyecto?'
      );
      if (result.isConfirmed) {
        await deleteData('projects', proyecto._id);
        AlertComponent.success('El proyecto ha sido eliminado correctamente.');
        fetchProjects();
      }
    } catch (error) {
      AlertComponent.error('Ocurrió un error durante la eliminación del registro.');
    }
  };

  const handleRestoreProject = async () => {
    try {
      await putData('projects/restore', `${proyecto._id}`);
      AlertComponent.success('El proyecto ha sido restaurado correctamente.');
      fetchProjects();
    } catch (error) {
      AlertComponent.error('Ocurrió un error al restaurar el proyecto.');
    }
  };

  return (
    <Card className={`project-card h-100 ${proyecto.isDeleted ? 'deleted-project' : ''}`}>
      <Card.Body>
        <Card.Title className="project-title">{proyecto.nombre}</Card.Title>
        <Badge bg={proyecto.isDeleted ? 'danger' : 'primary'} className="mb-2">
          {proyecto.estado}
        </Badge>
        <Card.Text>
          <strong>Objetivos:</strong> {proyecto.objetivos || 'N/A'} <br />
          <strong>Presupuesto:</strong> ${proyecto.presupuesto?.toLocaleString() || 'N/A'} <br />
          <strong>Fecha de Inicio:</strong> {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()} <br />
          <strong>Fecha Límite:</strong> {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex flex-column">
        {proyecto.isDeleted ? (
          <Button variant="outline-success" className="w-100" onClick={handleRestoreProject}>
            <FaUndo /> Restaurar
          </Button>
        ) : (
          <>
            <Button variant="outline-primary" className="w-100 mb-2" onClick={() => onViewDetails(proyecto)}>
              <FaInfoCircle /> Ver Detalles
            </Button>
            <Button variant="outline-secondary" className="w-100 mb-2" onClick={() => handleEditProject(proyecto._id)}>
              <FaEdit /> Editar
            </Button>
            <Button variant="outline-danger" className="w-100" onClick={handleDeleteProject}>
              <FaTrash /> Eliminar
            </Button>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}

export default AdmProjectCard;