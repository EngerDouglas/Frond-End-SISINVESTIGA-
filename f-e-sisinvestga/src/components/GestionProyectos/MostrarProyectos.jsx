import React from "react";
import '../../css/componentes/GestionProyectos/MostrarProyectos.css';

const MostrarProyectos = () => {
  // Lista de proyectos de ejemplo
  const proyectos = [
    {
      titulo: 'Proyecto 1',
      objetivos: 'Objetivo 1',
      presupuesto: '1000',
      fechaInicio: '2024-01-01',
      fechaLimite: '2024-12-31'
    },
    {
      titulo: 'Proyecto 2',
      objetivos: 'Objetivo 2',
      presupuesto: '2000',
      fechaInicio: '2024-02-01',
      fechaLimite: '2024-11-30'
    }
  ];

  return (
    <div id="mostrarProyectos">
      <ul id="Proyectos">
        {proyectos.map((proyecto, index) => (
          <li key={index}>
            <h3>{proyecto.titulo}</h3>
            <p>Objetivos: {proyecto.objetivos}</p>
            <p>Presupuesto: {proyecto.presupuesto}</p>
            <p>Fecha de Inicio: {proyecto.fechaInicio}</p>
            <p>Fecha Límite: {proyecto.fechaLimite}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostrarProyectos;