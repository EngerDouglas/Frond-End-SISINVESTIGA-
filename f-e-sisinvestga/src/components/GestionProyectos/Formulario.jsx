import React, { useState } from 'react';
import './css/componentes/GestionProyectos/Formulario.css';

const Formulario = ({ agregarProyecto }) => {
  const [proyectoDatos, setProyectoDatos] = useState({
    titulo: "",
    objetivos: "",
    presupuesto: "",
    fechaInicio: "",
    fechaLimite: ""
  });

  const manejoCambios = (e) => {
    const { name, value } = e.target;
    setProyectoDatos({
      ...proyectoDatos,
      [name]: value
    });
  };

  const manejoSubida = (e) => {
    e.preventDefault();
    agregarProyecto(proyectoDatos); 
    setProyectoDatos({
      titulo: "",
      objetivos: "",
      presupuesto: "",
      fechaInicio: "",
      fechaLimite: ""
    });
  };

  return (
    <form onSubmit={manejoSubida} className="form-container">
      <h2>Crear Proyecto</h2>
      <div className="form">
        <label>Título:</label>
        <input
          type="text"
          name="titulo"
          value={proyectoDatos.titulo}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Objetivos:</label>
        <textarea
          name="objetivos"
          value={proyectoDatos.objetivos}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Presupuesto:</label>
        <input
          type="number"
          name="presupuesto"
          value={proyectoDatos.presupuesto}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Fecha de Inicio:</label>
        <input
          type="date"
          name="fechaInicio"
          value={proyectoDatos.fechaInicio}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Fecha Límite:</label>
        <input
          type="date"
          name="fechaLimite"
          value={proyectoDatos.fechaLimite}
          onChange={manejoCambios}
        />
      </div>
      <button type="submit" className="submit-btn">Crear</button>
    </form>
  );
};

export default Formulario;