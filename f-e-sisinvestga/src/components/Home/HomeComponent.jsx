import React, { useEffect, useState } from "react";
import Nav from "../Comunes/Nav";
import { getData } from "../../services/apiServices";
import "../../css/componentes/Home/Home.css";

const HomeComponent = () => {
  const [projects, setProjectData] = useState([]);
  const [publications, setPublicationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Proyectos");
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
      <div className="home-container">
        {/* Barra de búsqueda */}
        <div className="home-search-container">
          <input
            type="text"
            placeholder="Buscar..."
            className="home-search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Pestañas */}
        <div className="home-tabs">
          <button
            className={`home-tab ${activeTab === "Proyectos" ? "active" : ""}`}
            onClick={() => setActiveTab("Proyectos")}
          >
            Proyectos
          </button>
          <button
            className={`home-tab ${
              activeTab === "Publicaciones" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Publicaciones")}
          >
            Publicaciones
          </button>
        </div>

        {/* Contenido */}
        {activeTab === "Proyectos" && (
          <div className="projects-section">
            {filteredProjects.length > 0 ? (
              <div className="cards-container">
                {filteredProjects.map((project) => (
                  <div key={project._id} className="project-card">
                    {/* Imagen del proyecto (si tienes una URL o un placeholder) */}
                    <div className="card-image">
                      <img
                        src={
                          project.imagen ||
                          "https://via.placeholder.com/300x200"
                        }
                        alt={project.nombre}
                      />
                    </div>
                    <div className="card-content">
                      <h3>{project.nombre}</h3>
                      <p>{project.descripcion.substring(0, 100)}...</p>
                      <p>
                        <strong>Estado:</strong> {project.estado}
                      </p>
                      {/* Botón "Ver más" */}
                      <button className="card-button">Ver más</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No se encontraron Proyectos</p>
            )}
          </div>
        )}

        {activeTab === "Publicaciones" && (
          <div className="publications-section">
            {filteredPublications.length > 0 ? (
              <div className="cards-container">
                {filteredPublications.map((publication) => (
                  <div key={publication._id} className="publication-card">
                    {/* Imagen de la publicación (si tienes una URL o un placeholder) */}
                    <div className="card-image">
                      <img
                        src={
                          publication.imagen ||
                          "https://via.placeholder.com/300x200"
                        }
                        alt={publication.titulo}
                      />
                    </div>
                    <div className="card-content">
                      <h3>{publication.titulo}</h3>
                      <p>{publication.resumen.substring(0, 100)}...</p>
                      <p>
                        <strong>Revista:</strong> {publication.revista}
                      </p>
                      {/* Botón "Ver más" */}
                      <button className="card-button">Ver más</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No se encontraron Publicaciones</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
