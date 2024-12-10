import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Table, Button, Badge, Alert, Form, Spinner
} from 'react-bootstrap';
import { FaEye, FaTrash, FaPaperclip, FaSearch, FaUndo } from 'react-icons/fa';
import { getDataParams, deleteData, putData } from '../../../services/apiServices';
import AdmPagination from '../Common/AdmPagination';
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
  const [filters, setFilters] = useState({
    tipoPublicacion: '',
    estado: '',
    isDeleted: ''
  });
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
        isDeleted: filters.isDeleted || undefined,
      };

      const response = await getDataParams('publications', params);
      setPublicationsData(response.publications);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      setError("Error loading publications. Please try again.");
      AlertComponent.error("Error loading publications");
    }
    setLoading(false);
  }, [currentPage, searchTerm, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPublications();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPublications]);

  const handleDelete = async (id) => {
    const result = await AlertComponent.warning("Are you sure you want to delete this publication?");
    if (result.isConfirmed) {
      try {
        await deleteData("publications", id);
        AlertComponent.success("Publication successfully delete");
        fetchPublications();
      } catch (error) {
        let errorMessage = "An error occurred during the deletion..";
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

  const handleRestore = async (id) => {
      try {
        await putData(`publications/restore`, id, {}); 
        AlertComponent.success("Publication successfully restored");
        fetchPublications();
      } catch (error) {
        let errorMessage = "An error occurred during the restoration.";
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
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value
    }));
    setCurrentPage(1);
  };

  const handleShowDetails = (publicationId) => {
    navigate(`/admin/publicaciones/editar/${publicationId}`);
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1 className="adm-pub-title">Publication Management</h1>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Row className="mb-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="searchTerm">
                <Form.Label><FaSearch style={{ color: '#006747' }} />Search by title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="tipoPublicacion">
                <Form.Label>Publication Type</Form.Label>
                <Form.Control
                  as="select"
                  name="tipoPublicacion"
                  value={filters.tipoPublicacion}
                  onChange={handleFilterChange}
                >
                  <option value="">All types</option>
                  <option value="Articulo">Article</option>
                  <option value="Informe">Report</option>
                  <option value="Tesis">Thesis</option>
                  <option value="Presentacion">Presentation</option>
                  <option value="Otro">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="estado">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">All statuses</option>
                  <option value="Borrador">Draft</option>
                  <option value="Revisado">Reviewed</option>
                  <option value="Publicado">Published</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="isDeleted">
                <Form.Check
                  type="checkbox"
                  label="Mostrar eliminados"
                  name="isDeleted"
                  checked={filters.isDeleted === 'true'}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Authors</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Attachments</th>
                      <th>Actions</th>
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
                          {publication.isDeleted ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleRestore(publication._id)}
                            >
                              <FaUndo /> Restore
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShowDetails(publication._id)}
                              >
                                <FaEye /> View/Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(publication._id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {totalPages > 1 && (
                <AdmPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdmSeePublications;
