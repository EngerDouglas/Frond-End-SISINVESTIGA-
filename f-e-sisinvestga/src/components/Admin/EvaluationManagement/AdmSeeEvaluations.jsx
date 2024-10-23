import React, { useState, useEffect, useCallback } from 'react';
import { getData, postData, putData, deleteData, getDataParams } from '../../../services/apiServices';
import AlertComponent from '../../Common/AlertComponent';
import Pagination from '../../Common/Pagination';
import '../../../css/Admin/AdmSeeEvaluations.css';

const AdmSeeEvaluations = () => {
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
      setLoading(true); // Mover setLoading aquí para mayor precisión
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
  }, [fetchEvaluations]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
    if (window.confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      try {
        await deleteData('evaluations', id);
        AlertComponent.success('Evaluación eliminada con éxito');
        fetchEvaluations();
      } catch (error) {
        AlertComponent.error('Error al eliminar la evaluación');
        console.error(error);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await putData(`evaluations/${id}/restore`);
      AlertComponent.success('Evaluación restaurada con éxito');
      fetchEvaluations();
    } catch (error) {
      AlertComponent.error('Error al restaurar la evaluación');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Evaluaciones</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="project" className="form-label">Proyecto</label>
          <select
            id="project"
            name="project"
            className="form-select"
            value={formData.project}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un proyecto</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="puntuacion" className="form-label">Puntuación</label>
          <input
            type="number"
            id="puntuacion"
            name="puntuacion"
            className="form-control"
            value={formData.puntuacion}
            onChange={handleInputChange}
            required
            min="0"
            max="100"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="comentarios" className="form-label">Comentarios</label>
          <textarea
            id="comentarios"
            name="comentarios"
            className="form-control"
            value={formData.comentarios}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Actualizar Evaluación' : 'Crear Evaluación'}
        </button>
      </form>

      {loading ? (
        <p>Cargando evaluaciones...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Evaluador</th>
                <th>Puntuación</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map(evaluation => (
                <tr key={evaluation._id} className={evaluation.isDeleted ? 'table-danger' : ''}>
                  <td>{evaluation.project.nombre}</td>
                  <td>{`${evaluation.evaluator.nombre} ${evaluation.evaluator.apellido}`}</td>
                  <td>{evaluation.puntuacion}</td>
                  <td>{evaluation.comentarios}</td>
                  <td>
                    {!evaluation.isDeleted ? (
                      <>
                        <button onClick={() => handleEdit(evaluation)} className="btn btn-sm btn-warning me-2">Editar</button>
                        <button onClick={() => handleDelete(evaluation._id)} className="btn btn-sm btn-danger">Eliminar</button>
                      </>
                    ) : (
                      <button onClick={() => handleRestore(evaluation._id)} className="btn btn-sm btn-success">Restaurar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AdmSeeEvaluations