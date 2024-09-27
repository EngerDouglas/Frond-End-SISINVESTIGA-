import React, { useState, useEffect } from "react";
import "../../css/componentes/Publicaciones/publicacionesInfo.css";
import { getData, deleteData } from "../../services/apiServices";

function PublicacionesInfo() {
  const [publicacionesData, setPublicacionesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const publications = await getData("Publications");
        setPublicacionesData(publications);
      } catch (error) {
        console.log("ERROR AL CARGAR PUBLICACIONES", error);
      }
    };

    fetchPublications();
  }, []);

  const handleUpdate = (publicacion) => {
    // Lógica para actualizar la publicación (redirigir a un formulario o abrir modal)
    console.log("Actualizar publicación:", publicacion);
  };

  const handleDelete = async (id) => {
    // Confirmar antes de eliminar
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      try {
        // Eliminar publicación usando DELETE
        await deleteData(`Publications/${id}`);
        // Actualizar lista de publicaciones tras eliminar
        const updatedPublicaciones = publicacionesData.filter((pub) => pub.id !== id);
        setPublicacionesData(updatedPublicaciones);
        console.log("Publicación eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la publicación", error);
      }
    }
  };

  const handleCreate = () => {
    // Lógica para crear una nueva publicación
    console.log("Crear nueva publicación");
  };

  const filteredPublicaciones = publicacionesData.filter((publicacion) =>
    publicacion.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="publicaciones-container">
      <h2>Lista de Publicaciones</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="btn-create" onClick={handleCreate}>
          Crear Publicación
        </button>
      </div>
      {filteredPublicaciones.length === 0 ? (
        <p>No hay publicaciones disponibles.</p>
      ) : (
        filteredPublicaciones.map((publicacion) => (
          <div key={publicacion.id} className="publicacion-card">
            <h3>{publicacion.titulo}</h3>
            <p><strong>Fecha:</strong> {new Date(publicacion.fecha).toLocaleDateString()}</p>
            <p><strong>Proyecto:</strong> {publicacion.proyecto.join(", ")}</p>
            <p><strong>Revista:</strong> {publicacion.revista}</p>
            <p><strong>Resumen:</strong> {publicacion.resumen}</p>
            <p><strong>Palabras Clave:</strong> {publicacion.palabrasClave.join(", ")}</p>
            <p><strong>Tipo de Publicación:</strong> {publicacion.tipoPublicacion}</p>
            <p><strong>Anexos:</strong> {publicacion.anexos.map((anexo, index) => (
              <a key={index} href={`/${anexo}`} download className="anexo-link">{anexo}</a>
            ))}</p>
            <p><strong>Idioma:</strong> {publicacion.idioma}</p>

            <div className="buttons">
              <button className="btn-update" onClick={() => handleUpdate(publicacion)}>
                Actualizar
              </button>
              <button className="btn-delete" onClick={() => handleDelete(publicacion.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PublicacionesInfo;
