import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Nav from "../../components/Comunes/Nav";
import { getDataById } from "../../services/apiServices";
import { format } from "date-fns";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import AuthorModal from "../../components/GestionInvestigadores/AuthorModal";
import "../../css/componentes/Publicaciones/PublicationsDetails.css";

const PublicationDetails = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author);
    setIsAuthorModalOpen(true);
  };

  const closeAuthorModal = () => {
    setIsAuthorModalOpen(false);
    setSelectedAuthor(null);
  };

  useEffect(() => {
    const fetchPublicationDetails = async () => {
      try {
        const data = await getDataById("publications/getpublication", id);
        setPublication(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles de la publication", error);
        setLoading(false);
      }
    };

    fetchPublicationDetails();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="publication-details-loading">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div>
        <Nav />
        <div className="publication-details-error">
          <p>No se pudo encontrar la publicacion.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="publication-details-container">
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link> / <span>{publication.titulo}</span>
        </nav>
        <h1 className="publication-details-title">{publication.titulo}</h1>
        <p className="publication-details-resumen">{publication.resumen}</p>

        <div className="publication-details-section">
          <h2>Información General</h2>
          <p>
            <strong>Revista:</strong> {publication.revista}
          </p>
          <p>
            <FaCalendarAlt /> <strong>Fecha de Publicación:</strong>{" "}
            {format(new Date(publication.fecha), "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Tipo de Publicación:</strong> {publication.tipoPublicacion}
          </p>
          <p>
            <strong>Idioma:</strong> {publication.idioma}
          </p>
          <p>
            <strong>Estado:</strong> {publication.estado}
          </p>
        </div>

        <div className="publication-details-section">
          <h2>Autores</h2>
          <ul>
            {publication.autores.map((autor) => (
              <li key={autor}>
                <span
                  className="author-name"
                  onClick={() => handleAuthorClick(autor)}
                >
                  <FaUser /> {autor.nombre} {autor.apellido}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="publication-details-section">
          <h2>Palabras Clave</h2>
          <ul>
            {publication.palabrasClave.map((palabra) => (
              <li key={palabra}>{palabra}</li>
            ))}
          </ul>
        </div>

        <div className="publication-details-section">
          <h2>Anexos</h2>
          <ul>
            {publication.anexos.map((anexo) => (
              <li key={anexo}>{anexo}</li>
            ))}
          </ul>
        </div>

        <div className="publication-details-section">
          <h2>Proyecto Asociado</h2>
          <p>
            <Link to={`/proyectos/${publication.proyecto._id}`}>
              {publication.proyecto.nombre}
            </Link>
          </p>
        </div>
      </div>

      {/* Modal de detalles del autor */}
      {isAuthorModalOpen && (
        <AuthorModal autor={selectedAuthor} onClose={closeAuthorModal} />
      )}
    </div>
  );
};

export default PublicationDetails;
