import React, { useEffect, useState } from "react";
import Nav from "../Comunes/Nav";
import { getData } from "../../services/apiServices";
import '../../css/componentes/Home/Home.css'

const HomeComponent = () => {
  const [projects, setProjectData] = useState([]);
  const [publications, setPublicationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await getData("projects");
        setProjectData(fetchedProjects);

        const fetchedPublications = await getData("publications");
        setPublicationData(fetchedPublications);
        setLoading(false);
      } catch (error) {
        console.error("Error al traer los datos", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.objetivos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPublications = publications.filter((publication) =>
    publication.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <p>Loading......</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="search-bar"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <h2>Proyectos</h2>
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.nombre}</h3>
            <p>
              <strong>Descripción:</strong> {project.descripcion}
            </p>
            <p>
              <strong>Objetivos:</strong> {project.objetivos}
            </p>
            <p>
              <strong>Presupuesto:</strong> ${project.presupuesto}
            </p>
            <p>
              <strong>Estado:</strong> {project.estado}
            </p>
            <p>
              <strong>Fecha de inicio:</strong>{" "}
              {new Date(project.cronograma.fechaInicio).toLocaleDateString()}
            </p>
            <p>
              <strong>Fecha de fin:</strong>{" "}
              {new Date(project.cronograma.fechaFin).toLocaleDateString()}
            </p>

            <h4>Investigadores:</h4>
            <ul>
              {project.investigadores.map((investigador) => (
                <li key={investigador._id}>
                  {investigador.nombre} {investigador.apellido}
                </li>
              ))}
            </ul>

            <h4>Recursos:</h4>
            <ul>
              {project.recursos.map((recurso, index) => (
                <li key={index}>{recurso}</li>
              ))}
            </ul>

            <h4>Hitos:</h4>
            <ul>
              {project.hitos.map((hito) => (
                <li key={hito._id}>
                  {hito.nombre} - Entregable: {hito.entregable} - Fecha:{" "}
                  {new Date(hito.fecha).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No se encontraron Proyectos</p>
      )}

      <h2>Publicaciones</h2>
      {filteredPublications.length > 0 ? (
        filteredPublications.map((publication) => (
          <div key={publication._id} className="publication-card">
            <h3>{publication.titulo}</h3>
            <p>
              <strong>Resumen:</strong> {publication.resumen}
            </p>
            <p>
              <strong>Fecha de publicación:</strong>{" "}
              {new Date(publication.fecha).toLocaleDateString()}
            </p>
            <p>
              <strong>Estado:</strong> {publication.estado}
            </p>
            <p>
              <strong>Revista:</strong> {publication.revista}
            </p>

            <h4>Autores:</h4>
            <ul>
              {publication.autores.map((autor, index) => (
                <li key={index}>
                  {autor.nombre} {autor.apellido} - {autor.especializacion}
                </li>
              ))}
            </ul>

            <h4>Anexos:</h4>
            <ul>
              {publication.anexos.map((anexo, index) => (
                <li key={index}>
                  <a href={anexo} target="_blank" rel="noopener noreferrer">
                    Ver anexo {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No se encontraron Publicaciones</p>
      )}
    </div>
  );
};

export default HomeComponent;
