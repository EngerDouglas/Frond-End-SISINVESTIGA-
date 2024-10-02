import React from "react";
import FiltroBusqueda from "../../components/GestionProyectos/FiltroBusqueda";
import MostrarProyectos from "../../components/GestionProyectos/MostrarProyectos";

const ListaProyectos = () => {
  return (
    <div id="ListaProyectos">

      <FiltroBusqueda></FiltroBusqueda>

      <MostrarProyectos></MostrarProyectos>
      
    </div>
  );
};

export default ListaProyectos;