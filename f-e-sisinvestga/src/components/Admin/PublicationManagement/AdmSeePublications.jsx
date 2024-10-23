import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Form } from 'react-bootstrap';
import { FaEye, FaTrash, FaPaperclip } from 'react-icons/fa';
import { getDataParams, deleteData } from '../../../services/apiServices';
import Pagination from '../../../components/Common/Pagination';
import SearchBar from '../../../components/Common/SearchBar';
import AlertComponent from '../../../components/Common/AlertComponent';
import '../../../css/Admin/AdmSeePublications.css';
import notimage from '../../../assets/img/notimage.png';

const AdmSeePublications = () => {
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ tipoPublicacion: '', estado: '' });
  const [showDeleted, setShowDeleted] = useState(false);
  const navigate = useNavigate();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        titulo: searchTerm || undefined,
        tipoPublicacion: filters.tipoPublicacion || undefined,
        estado: filters.estado || undefined,
        isDeleted: showDeleted.toString(),
      };

      const response = await getDataParams('publications', params);
      setPublicationsData(response.publications);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      console.error("Error al obtener las publicaciones", error);
      setError("Error al cargar las publicaciones. Por favor, intente de nuevo.");
      AlertComponent.error("Error al cargar las publicaciones");
    }
    setLoading(false);
  }, [currentPage, searchTerm, filters.tipoPublicacion, filters.estado, showDeleted]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPublications();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPublications]);

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("¿Está seguro de que desea eliminar esta publicación?");
    if (result.isConfirmed) {
      try {
        await deleteData("publications", id);
        AlertComponent.success("Publicación eliminada con éxito");
        fetchPublications();
      } catch (error) {
        let errorMessage = "Ocurrió un error durante la eliminación del registro.";
        let detailedErrors = [];

        try {
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.message;
          detailedErrors = parsedError.errors || [];
        } catch (parseError) {
          errorMessage = error.message;
        }
        AlertComponent.error(errorMessage);
        detailedErrors.forEach((err) => AlertComponent.error(err));
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleShowDetails = (publicationId) => {
    navigate(`/admin/publicaciones/editar/${publicationId}`);
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1 className="adm-pub-title">Gestión de Publicaciones</h1>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar por título..."
              />
            </Col>
            <Col md={4}>
              <select
                className="form-select"
                name="tipoPublicacion"
                value={filters.tipoPublicacion}
                onChange={handleFilterChange}
              >
                <option value="">Todos los tipos</option>
                <option value="Articulo">Artículo</option>
                <option value="Informe">Informe</option>
                <option value="Tesis">Tesis</option>
                <option value="Presentacion">Presentación</option>
                <option value="Otro">Otro</option>
              </select>
            </Col>
            <Col md={4}>
              <select
                className="form-select"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
              >
                <option value="">Todos los estados</option>
                <option value="Borrador">Borrador</option>
                <option value="Revisado">Revisado</option>
                <option value="Publicado">Publicado</option>
              </select>
            </Col>
            <Col md={4}>
              <Form.Check 
                  type="checkbox"
                  label="Mostrar publicaciones eliminadas"
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
              />
            </Col>
          </Row>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Autores</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Anexos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {publicationsData.map((publication) => (
                    <tr key={publication._id}>
                      <td>
                        <img 
                          src={publication.imagen || notimage} 
                          alt={publication.titulo}
                          className="publication-thumbnail"
                        />
                      </td>
                      <td>{publication.titulo}</td>
                      <td>{publication.autores.map(autor => `${autor.nombre} ${autor.apellido}`).join(', ')}</td>
                      <td>{publication.tipoPublicacion}</td>
                      <td>
                        <Badge bg={
                          publication.estado === 'Publicado' ? 'success' :
                          publication.estado === 'Revisado' ? 'warning' : 'secondary'
                        }>
                          {publication.estado}
                        </Badge>
                      </td>
                      <td>{new Date(publication.fecha).toLocaleDateString()}</td>
                      <td>
                        {publication.anexos && publication.anexos.length > 0 ? (
                          <Button variant="link" onClick={() => handleShowDetails(publication._id)}>
                            <FaPaperclip /> {publication.anexos.length}
                          </Button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <Button variant="info" size="sm" className="me-2" onClick={() => handleShowDetails(publication._id)}>
                          <FaEye /> Ver/Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(publication._id)}>
                          <FaTrash /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            onPrev={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabledPrev={currentPage === 1}
            disabledNext={currentPage === totalPages}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdmSeePublications;