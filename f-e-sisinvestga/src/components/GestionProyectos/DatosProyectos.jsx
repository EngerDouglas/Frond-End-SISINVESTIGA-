import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DatosProyectos = ({ id }) => {
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProyecto = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/projects/${id}`);
        setProyecto(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    obtenerProyecto();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!proyecto) return <div>No se encontró el proyecto</div>;

  return (
    <div>
      <h1>{proyecto.nombre}</h1>
      <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
      <p><strong>Objetivos:</strong> {proyecto.objetivos}</p>
      <p><strong>Presupuesto:</strong> ${proyecto.presupuesto}</p>
      
      <div>
        <h3>Cronograma</h3>
        <p><strong>Fecha Inicio:</strong> {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()}</p>
        <p><strong>Fecha Fin:</strong> {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}</p>
      </div>

      <div>
        <h3>Investigadores</h3>
        <ul>
          {proyecto.investigadores.map((investigador, index) => (
            <li key={index}>{investigador.nombre}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Recursos</h3>
        <ul>
          {proyecto.recursos.map((recurso, index) => (
            <li key={index}>{recurso}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Hitos</h3>
        <ul>
          {proyecto.hitos.map((hito, index) => (
            <li key={index}>
              <p><strong>Nombre:</strong> {hito.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(hito.fecha).toLocaleDateString()}</p>
              <p><strong>Entregable:</strong> {hito.entregable}</p>
            </li>
          ))}
        </ul>
      </div>

      <p><strong>Estado:</strong> {proyecto.estado}</p>

      {/* Botón para crear publicación */}
      <button style={buttonStyle} onClick={() => alert("Función de creación de publicación aquí")}>
        Crear Publicación
      </button>
    </div>
  );
};

export default DatosProyectos;