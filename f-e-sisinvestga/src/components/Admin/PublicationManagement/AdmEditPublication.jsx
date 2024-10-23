import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEdit, FaUndo, FaSave } from 'react-icons/fa';
import { getData, getDataById, putData } from '../../../services/apiServices';
import AlertComponent from '../../../components/Common/AlertComponent';
import '../../../css/Admin/AdmEditPublication.css';

const AdmEditPublication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState(null);
  const [editedPublication, setEditedPublication] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const data = await getDataById('publications/getpublication', id);
        setPublication(data);
        setEditedPublication(JSON.parse(JSON.stringify(data)));
        setError(null);
      } catch (error) {
        console.error("Error al obtener la publicación", error);
        setError("Error al cargar la publicación. Por favor, intente de nuevo.");
        AlertComponent.error("Error al cargar la publicación");
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  useEffect(() => {
    // Obtener usuarios y proyectos
    const fetchData = async () => {
      try {
        const usuariosData = await getData('users');
        setUsuarios(usuariosData);
        const proyectosData = await getData('projects');
        if (proyectosData.projects) {
          setProyectos(proyectosData.projects);
        } else {
          setProyectos(proyectosData); 
        }
      } catch (error) {
        console.error("Error al cargar usuarios o proyectos", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPublication(JSON.parse(JSON.stringify(publication)));
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPublication(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Preparar los datos a enviar
      const updatedPublication = {
        ...editedPublication,
        proyecto: editedPublication.proyecto._id,
        autores: editedPublication.autores.map((autor) => autor._id),
      };

      const result = await putData('publications/admin', id, updatedPublication);
      setPublication(result.publication);
      setEditedPublication(result.publication);
      setIsEditing(false);
      setError(null);
      AlertComponent.success("Publicación actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar la publicación", error);
      let errorMessage = "Error al actualizar la publicación";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      AlertComponent.error(errorMessage);
    }
  };

  const handleRestore = async () => {
    try {
      await putData('publications/restore', id);
      AlertComponent.success("Publicación restaurada con éxito");
      navigate('/admin/publicaciones');
    } catch (error) {
      console.error("Error al restaurar la publicación", error);
      AlertComponent.error("Error al restaurar la publicación");
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">
            {isEditing ? 'Editar Publicación' : 'Detalles de la Publicación'}
          </Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={isEditing ? editedPublication.titulo : publication.titulo}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Publicación</Form.Label>
                  <Form.Control
                    as="select"
                    name="tipoPublicacion"
                    value={isEditing ? editedPublication.tipoPublicacion : publication.tipoPublicacion}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="Articulo">Artículo</option>
                    <option value="Informe">Informe</option>
                    <option value="Tesis">Tesis</option>
                    <option value="Presentacion">Presentación</option>
                    <option value="Otro">Otro</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={isEditing ? editedPublication.fecha.split('T')[0] : publication.fecha.split('T')[0]}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    name="estado"
                    value={isEditing ? editedPublication.estado : publication.estado}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="Revisado">Revisado</option>
                    <option value="Publicado">Publicado</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Resumen</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="resumen"
                value={isEditing ? editedPublication.resumen : publication.resumen}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </Form.Group>

            {/* Palabras Clave */}
            <Form.Group className="mb-3">
              <Form.Label>Palabras Clave</Form.Label>
              <Form.Control
                type="text"
                name="palabrasClave"
                value={
                  isEditing
                    ? editedPublication.palabrasClave.join(', ')
                    : publication.palabrasClave.join(', ')
                }
                onChange={(e) => {
                  const value = e.target.value.split(',').map((word) => word.trim());
                  setEditedPublication((prev) => ({ ...prev, palabrasClave: value }));
                }}
                readOnly={!isEditing}
              />
            </Form.Group>

            {/* Autores */}
            <Form.Group className="mb-3">
              <Form.Label>Autores</Form.Label>
              {isEditing ? (
                <>
                  {editedPublication.autores.map((autor, index) => (
                    <div key={index} className="mb-2">
                      <Form.Control
                        as="select"
                        value={autor._id}
                        onChange={(e) => {
                          const usuarioSeleccionado = usuarios.find((u) => u._id === e.target.value);
                          const nuevosAutores = [...editedPublication.autores];
                          nuevosAutores[index] = usuarioSeleccionado;
                          setEditedPublication((prev) => ({ ...prev, autores: nuevosAutores }));
                        }}
                      >
                        {usuarios.map((usuario) => (
                          <option key={usuario._id} value={usuario._id}>
                            {usuario.nombre} {usuario.apellido}
                          </option>
                        ))}
                      </Form.Control>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const nuevosAutores = editedPublication.autores.filter((_, i) => i !== index);
                          setEditedPublication((prev) => ({ ...prev, autores: nuevosAutores }));
                        }}
                        className="mt-1"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const nuevosAutores = [...editedPublication.autores, usuarios[0]];
                      setEditedPublication((prev) => ({ ...prev, autores: nuevosAutores }));
                    }}
                  >
                    Agregar Autor
                  </Button>
                </>
              ) : (
                <Form.Control
                  type="text"
                  value={publication.autores.map((autor) => `${autor.nombre} ${autor.apellido}`).join(', ')}
                  readOnly
                />
              )}
            </Form.Group>

            {/* Proyecto en caso de querer modificar el proyecto eliminar readonly*/}
            <Form.Group className="mb-3">
              <Form.Label>Proyecto</Form.Label>
              {isEditing ? (
                <Form.Control
                  as="select"
                  name="proyecto"
                  value={editedPublication.proyecto._id}
                  onChange={(e) => {
                    const proyectoSeleccionado = proyectos.find((p) => p._id === e.target.value);
                    setEditedPublication((prev) => ({ ...prev, proyecto: proyectoSeleccionado }));
                  }}
                  readOnly
                >
                  {Array.isArray(proyectos) && proyectos.map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  value={publication.proyecto ? publication.proyecto.nombre : 'No asignado'}
                  readOnly
                />
              )}
            </Form.Group>

            {/* Anexos */}
            <Form.Group className="mb-3">
              <Form.Label>Anexos</Form.Label>
              {isEditing ? (
                <>
                  {editedPublication.anexos.map((anexo, index) => (
                    <div key={index} className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Nombre del anexo"
                        value={anexo.nombre}
                        onChange={(e) => {
                          const newAnexos = [...editedPublication.anexos];
                          newAnexos[index].nombre = e.target.value;
                          setEditedPublication((prev) => ({ ...prev, anexos: newAnexos }));
                        }}
                        className="mb-1"
                      />
                      <Form.Control
                        type="text"
                        placeholder="URL del anexo"
                        value={anexo.url}
                        onChange={(e) => {
                          const newAnexos = [...editedPublication.anexos];
                          newAnexos[index].url = e.target.value;
                          setEditedPublication((prev) => ({ ...prev, anexos: newAnexos }));
                        }}
                        className="mb-1"
                      />
                      <Form.Control
                        type="text"
                        placeholder="Tipo del anexo"
                        value={anexo.tipo}
                        onChange={(e) => {
                          const newAnexos = [...editedPublication.anexos];
                          newAnexos[index].tipo = e.target.value;
                          setEditedPublication((prev) => ({ ...prev, anexos: newAnexos }));
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const newAnexos = editedPublication.anexos.filter((_, i) => i !== index);
                          setEditedPublication((prev) => ({ ...prev, anexos: newAnexos }));
                        }}
                        className="mt-1"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const newAnexos = [...editedPublication.anexos, { nombre: '', url: '', tipo: '' }];
                      setEditedPublication((prev) => ({ ...prev, anexos: newAnexos }));
                    }}
                  >
                    Agregar Anexo
                  </Button>
                </>
              ) : (
                <ul>
                  {publication.anexos.map((anexo, index) => (
                    <li key={index}>
                      {anexo.nombre} - {anexo.tipo} - <a href={anexo.url} target='_blank'>Ver Archivo</a>
                    </li>
                  ))}
                </ul>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado de Eliminación</Form.Label>
              <Form.Control
                type="text"
                value={publication.isDeleted ? 'Eliminado' : 'Activo'}
                readOnly
              />
            </Form.Group>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            {!isEditing && (
              <>
                <Button variant="primary" onClick={handleEdit} className="me-2">
                  <FaEdit /> Editar
                </Button>
                {publication.isDeleted && (
                  <Button variant="warning" onClick={handleRestore}>
                    <FaUndo /> Restaurar
                  </Button>
                )}
              </>
            )}
            {isEditing && (
              <>
                <Button variant="success" onClick={handleSave} className="me-2">
                  <FaSave /> Guardar
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdmEditPublication