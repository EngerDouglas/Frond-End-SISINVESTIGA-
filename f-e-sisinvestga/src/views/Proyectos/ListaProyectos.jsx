import React from "react";
import FiltroBusqueda from "../componentes/FiltroBusqueda";
import MostrarProyectos from "../componentes/MostrarProyectos";

const ListaProyectos = () => {
  return (
    <div id="ListaProyectos">

      <FiltroBusqueda></FiltroBusqueda>

      <MostrarProyectos></MostrarProyectos>
      
    </div>
  );
}

export default ListaProyectos;