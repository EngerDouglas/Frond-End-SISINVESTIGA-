import React from "react";
import './css/componentes/GestionProyectos/FiltroBusqueda.css';

const FiltroBusqueda = ({ onCrearProyecto }) => {
  return (
    <div id="BarraUtilidad">
      <div id="BarraBusqueda">
        <input placeholder="Buscar Proyecto" />
        <button onClick={onCrearProyecto}>Crear Proyecto</button> 
      </div>

      <div id="Filtro">
        <button className="botonFiltro">Filtrar</button>
        <button className="botonFiltro">Nombre</button>
        <button className="botonFiltro">Fecha</button>
        <button className="botonFiltro">Presupuesto</button>
      </div>
    </div>
  );
};

export default FiltroBusqueda;