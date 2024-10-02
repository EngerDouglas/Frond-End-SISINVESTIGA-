import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../Comunes/Nav";
import { getDataParams } from "../../services/apiServices";
import "../../css/componentes/Home/Home.css";
import img1 from "../../img/invest.jpg";
import img2 from "../../img/invest2.jpg";
import img3 from "../../img/invest3.jpg";
import { Carousel } from "react-bootstrap";

const HomeComponent = () => {
  const [projects, setProjectData] = useState([]);
  const [publications, setPublicationData] = useState([]);
  const [projectStates, setProjectStates] = useState([]);
  const [publicationTypes, setPublicationTypes] = useState([]);
  const [selectedProjectState, setSelectedProjectState] = useState("");
  const [selectedPublicationTipo, setSelectedPublicationTipo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Proyectos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "Proyectos") {
          const projectParams = {};
          if (selectedProjectState) {
            projectParams.estado = selectedProjectState;
          }
          if (searchTerm) {
            projectParams.nombre = searchTerm;
          }
          const fetchedProjects = await getDataParams(
            "projects",
            projectParams
          );
          setProjectData(fetchedProjects);

          const uniqueStates = [
            ...new Set(fetchedProjects.map((project) => project.estado)),
          ];
          setProjectStates(uniqueStates);
        } else if (activeTab === "Publicaciones") {
          const publicationParams = {};
          if (selectedPublicationTipo) {
            publicationParams.tipoPublicacion = selectedPublicationTipo;
          }
          if (searchTerm) {
            publicationParams.titulo = searchTerm;
          }

          const fetchedPublications = await getDataParams(
            "publications",
            publicationParams
          );
          setPublicationData(fetchedPublications);

          const uniqueTypes = [
            ...new Set(fetchedPublications.map((pub) => pub.tipoPublicacion)),
          ];
          setPublicationTypes(uniqueTypes);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al traer los datos", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, selectedProjectState, selectedPublicationTipo, activeTab]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="home-container">
        {/* Carrusel */}
        <Carousel className="mb-4">
          <Carousel.Item interval={3000}>
            <img className="d-block w-100" src={img1} alt="First slide" />
            <Carousel.Caption>
              <h3>Investigación 1</h3>
              <p>Detalles del proyecto de investigación 1.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img className="d-block w-100" src={img2} alt="Second slide" />
            <Carousel.Caption>
              <h3>Investigación 2</h3>
              <p>Detalles del proyecto de investigación 2.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img className="d-block w-100" src={img3} alt="Third slide" />
            <Carousel.Caption>
              <h3>Investigación 3</h3>
              <p>Detalles del proyecto de investigación 3.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

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

        {/* Filtros */}
        <div className="filters-container">
          {activeTab === "Proyectos" && (
            <div className="filter-group">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                value={selectedProjectState}
                onChange={(e) => setSelectedProjectState(e.target.value)}
              >
                <option value="">Todos</option>
                {projectStates.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === "Publicaciones" && (
            <div className="filter-group">
              <label htmlFor="tipoPublicacion">Tipo de Publicación:</label>
              <select
                id="tipoPublicacion"
                value={selectedPublicationTipo}
                onChange={(e) => setSelectedPublicationTipo(e.target.value)}
              >
                <option value="">Todas</option>
                {publicationTypes.map((tipoPublicacion) => (
                  <option key={tipoPublicacion} value={tipoPublicacion}>
                    {tipoPublicacion}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Contenido */}
        {activeTab === "Proyectos" && (
          <div className="projects-section">
            {projects.length > 0 ? (
              <div className="cards-container">
                {projects.map((project) => (
                  <div key={project._id} className="project-card">
                    {/* Imagen del proyecto */}
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
                      <Link
                        to={`/proyectos/${project._id}`}
                        className="card-button"
                      >
                        Ver más
                      </Link>
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
            {publications.length > 0 ? (
              <div className="cards-container">
                {publications.map((publication) => (
                  <div key={publication._id} className="publication-card">
                    {/* Imagen de la publicación */}
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
                        <strong>Tipo:</strong> {publication.tipoPublicacion}
                      </p>
                      {/* Botón "Ver más" */}
                      <Link
                        to={`/publicaciones/${publication._id}`}
                        className="card-button"
                      >
                        Ver más
                      </Link>
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
