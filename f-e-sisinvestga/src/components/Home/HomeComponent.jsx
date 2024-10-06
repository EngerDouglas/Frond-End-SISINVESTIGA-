import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Nav from "../Comunes/Nav";
import { getDataParams } from "../../services/apiServices";
import Pagination from "../Comunes/Pagination";
import "../../css/componentes/Home/Home.css";
import img1 from "../../img/invest.jpg";
import img2 from "../../img/invest2.jpg";
import img3 from "../../img/invest3.jpg";
import { useDebounce } from "use-debounce";
import { Carousel } from "react-bootstrap";

const HomeComponent = () => {
  const [projects, setProjectData] = useState([]);
  const [publications, setPublicationData] = useState([]);
  const [projectStates, setProjectStates] = useState([]);
  const [publicationTypes, setPublicationTypes] = useState([]);
  const [selectedProjectState, setSelectedProjectState] = useState("");
  const [selectedPublicationTipo, setSelectedPublicationTipo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [activeTab, setActiveTab] = useState("Proyectos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "Proyectos") {
        const projectParams = {
          page: currentPage,
          limit: 5,
        };
        if (selectedProjectState) {
          projectParams.estado = selectedProjectState;
        }
        if (debouncedSearchTerm) {
          projectParams.nombre = debouncedSearchTerm;
        }
        const result = await getDataParams("projects", projectParams);
        setProjectData(result.projects || []);
        setTotalPages(result.totalPages || 1);

        const uniqueStates = [
          ...new Set((result.projects || []).map((project) => project.estado)),
        ];
        setProjectStates(uniqueStates);
      } else if (activeTab === "Publicaciones") {
        const publicationParams = {
          page: currentPage,
          limit: 5,
        };
        if (selectedPublicationTipo) {
          publicationParams.tipoPublicacion = selectedPublicationTipo;
        }
        if (debouncedSearchTerm) {
          publicationParams.titulo = debouncedSearchTerm;
        }

        const result = await getDataParams("publications", publicationParams);
        setPublicationData(result.publications || []);
        setTotalPages(result.totalPages || 1);

        const uniqueTypes = [
          ...new Set(
            (result.publications || []).map((pub) => pub.tipoPublicacion)
          ),
        ];
        setPublicationTypes(uniqueTypes);
      }
    } catch (error) {
      console.error("Error al traer los datos", error);
      setProjectData([]);
      setPublicationData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    currentPage,
    debouncedSearchTerm,
    selectedProjectState,
    selectedPublicationTipo,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <Nav />

      <div className="carousel-container">
        <Carousel className="mb-4">
          <Carousel.Item interval={3000}>
            <img className="d-block w-100" src={img1} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img className="d-block w-100" src={img2} alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img className="d-block w-100" src={img3} alt="Third slide" />
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="home-container">
        <div className="home-search-container">
          <input
            type="text"
            placeholder="Buscar..."
            className="home-search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="home-tabs">
          <button
            className={`home-tab ${activeTab === "Proyectos" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("Proyectos");
              setCurrentPage(1);
            }}
          >
            Proyectos
          </button>
          <button
            className={`home-tab ${
              activeTab === "Publicaciones" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("Publicaciones");
              setCurrentPage(1);
            }}
          >
            Publicaciones
          </button>
        </div>

        <div className="filters-container">
          {activeTab === "Proyectos" && (
            <div className="filter-group">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                value={selectedProjectState}
                onChange={(e) => {
                  setSelectedProjectState(e.target.value);
                  setCurrentPage(1);
                }}
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
              <label htmlFor="tipo">Tipo:</label>
              <select
                id="tipo"
                value={selectedPublicationTipo}
                onChange={(e) => {
                  setSelectedPublicationTipo(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Todos</option>
                {publicationTypes.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {activeTab === "Proyectos" && (
          <div className="projects-section">
            {loading ? (
              <p>Cargando proyectos...</p>
            ) : projects.length > 0 ? (
              <div className="cards-container">
                {projects.map((project) => (
                  <div key={project._id} className="project-card">
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
                      <p>
                        {project.descripcion
                          ? project.descripcion.substring(0, 100) + "..."
                          : "No hay descripción disponible"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {project.estado}
                      </p>
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
            {loading ? (
              <p>Cargando publicaciones...</p>
            ) : publications.length > 0 ? (
              <div className="cards-container">
                {publications.map((publication) => (
                  <div key={publication._id} className="publication-card">
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
                      <p>
                        {publication.resumen
                          ? publication.resumen.substring(0, 100) + "..."
                          : "No hay resumen disponible"}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {publication.tipoPublicacion}
                      </p>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          disabledPrev={currentPage === 1}
          disabledNext={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default HomeComponent;
