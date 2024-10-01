import React from "react";
import MostrarProyectos from "../../components/GestionProyectos/MostrarProyectos";
import Nav from '../../components/Comunes/NavAdmin'

const ListaProyectos = () => {
  return (
    <div id="ListaProyectos">
      <Nav></Nav>
      <MostrarProyectos></MostrarProyectos>
      
    </div>
  );
}

export default ListaProyectos;