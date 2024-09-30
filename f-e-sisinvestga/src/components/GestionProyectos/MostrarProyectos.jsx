import React, { useEffect, useState } from "react";
import '../../css/componentes/GestionProyectos/MostrarProyectos.css';

const MostrarProyectos = () => {
  const [proyectos, setProyectos] = useState([]);

  const obtenerProyectos = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/projects'); 
      const data = await response.json();
      setProyectos(data);  
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
  };

  useEffect(() => {
    obtenerProyectos(); 
  }, []);


  const handleProjectClick = (id) => {
    console.log(`Proyecto seleccionado con ID: ${id}`);
    // Logica para redirigir a detalles del proyecto
  };

  return (
    <div id="mostrarProyectos">
      <ul id="Proyectos">
        {proyectos.length > 0 ? (
          proyectos.map((proyecto) => (
            <li 
              key={proyecto._id} 
              onClick={() => handleProjectClick(proyecto._id)}  
              className="proyecto-item"  
            >
              <h3>{proyecto.nombre}</h3>
              <p>Descripción: {proyecto.descripcion}</p>
              <p>Presupuesto: ${proyecto.presupuesto}</p>
              <p>Fecha de Inicio: {new Date(proyecto.cronograma.fechaInicio).toLocaleDateString()}</p>
              <p>Fecha Límite: {new Date(proyecto.cronograma.fechaFin).toLocaleDateString()}</p>
              <p>Estado: {proyecto.estado}</p>
            </li>
          ))
        ) : (
          <p>No hay proyectos disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default MostrarProyectos;