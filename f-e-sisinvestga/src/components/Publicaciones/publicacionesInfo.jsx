import React, { useState, useEffect } from "react";
import "../../css/componentes/Publicaciones/publicacionesInfo.css";
import { getData, deleteData,updateData } from "../../services/apiServices"; // Asume que updateData existe

function PublicacionesInfo() {
  const [publicacionesData, setPublicacionesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPublicacion, setCurrentPublicacion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const publications = await getData("Publications");
        // Verificamos que publications sea un array, si no lo es, se asigna un array vacío
        setPublicacionesData(Array.isArray(publications) ? publications : []);
      } catch (error) {
        console.log("ERROR AL CARGAR PUBLICACIONES", error);
        setPublicacionesData([]); // En caso de error, se establece un array vacío
        setIsLoading(false)
      }
    };

    fetchPublications();
  }, []);

    

  const handleUpdate = (publicacion) => {
    setCurrentPublicacion(publicacion);
    setIsModalOpen(true);
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
    console.log("Crear nueva publicación");
  };

  const handleSaveUpdate = async () => {
    try {
      await updateData(`Publications/${currentPublicacion.id}`, currentPublicacion);
      const updatedPublicaciones = publicacionesData.map((pub) =>
        pub.id === currentPublicacion.id ? currentPublicacion : pub
      );
      setPublicacionesData(updatedPublicaciones);
      setIsModalOpen(false);
      console.log("Publicación actualizada con éxito.");
    } catch (error) {
      console.error("Error al actualizar la publicación", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPublicacion({ ...currentPublicacion, [name]: value });
  };

  const filteredPublicaciones = publicacionesData.filter((publicacion) =>
    publicacion.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Cargando publicaciones...</div>;

  return (
    <div className="publicaciones-container">
      <h2>Lista de Publicaciones</h2>
      <div className="pub-search-bar">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pub-search-input"
        />
        <button className="pub-btn-create" onClick={handleCreate}>
          Crear Publicación
        </button>
      </div>
      {filteredPublicaciones.length === 0 ? (
        <p>No hay publicaciones disponibles.</p>
      ) : (
        filteredPublicaciones.map((publicacion) => (
          <div key={publicacion._id} className="publicacion-card">
            <h3>{publicacion.titulo}</h3>
            <p><strong>Fecha:</strong> {new Date(publicacion.fecha).toLocaleDateString()}</p>
            <p><strong>Proyecto:</strong> {publicacion.proyecto ? publicacion.proyecto.nombre : 'N/A'}</p>
            <p><strong>Revista:</strong> {publicacion.revista}</p>
            <p><strong>Resumen:</strong> {publicacion.resumen}</p>
            <p><strong>Palabras Clave:</strong> {publicacion.palabrasClave.join(", ")}</p>
            <p><strong>Tipo de Publicación:</strong> {publicacion.tipoPublicacion}</p>
            <p><strong>Anexos:</strong> {publicacion.anexos.map((anexo, index) => (
              <a key={index} href={anexo} target="_blank" rel="noopener noreferrer" className="anexo-link">{`Anexo ${index + 1}`}</a>
            ))}</p>
            <p><strong>Idioma:</strong> {publicacion.idioma}</p>

            <div className="pub-buttons">
              <button className="pub-btn-update" onClick={() => handleUpdate(publicacion)}>
                Actualizar
              </button>
              <button className="pub-btn-delete" onClick={() => handleDelete(publicacion._id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}

      {isModalOpen && currentPublicacion && (
        <div className="modal">
          <div className="modal-content">
            <h3>Actualizar Publicación</h3>
            <input
              type="text"
              name="titulo"
              value={currentPublicacion.titulo}
              onChange={handleChange}
              placeholder="Título"
            />
            <input
              type="text"
              name="revista"
              value={currentPublicacion.revista}
              onChange={handleChange}
              placeholder="Revista"
            />
            <textarea
              name="resumen"
              value={currentPublicacion.resumen}
              onChange={handleChange}
              placeholder="Resumen"
            />
            <button onClick={handleSaveUpdate}>Guardar</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicacionesInfo;
