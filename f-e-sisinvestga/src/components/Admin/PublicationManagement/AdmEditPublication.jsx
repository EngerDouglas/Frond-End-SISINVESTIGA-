import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { FaEdit, FaUndo, FaSave } from 'react-icons/fa';
import { getDataById, getData, putData } from '../../../services/apiServices';
import AlertComponent from '../../../components/Common/AlertComponent';
import AdmPublicationForm from './AdmPublicationForm';
import AdmPubAuthorsForm from './AdmPubAuthorsForm';
import AdmPubAnexosForm from './AdmPubAnexosForm';
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

  // Estados adicionales para los anexos
  const [existingAnexos, setExistingAnexos] = useState([]);
  const [newAnexos, setNewAnexos] = useState([]);
  const [anexosToDelete, setAnexosToDelete] = useState([]);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const data = await getDataById('publications/getpublication', id);
        setPublication(data);
        setEditedPublication(JSON.parse(JSON.stringify(data)));
        setExistingAnexos(data.anexos || []);
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
        setProyectos(proyectosData.projects || proyectosData);
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
    setExistingAnexos(publication.anexos || []);
    setNewAnexos([]);
    setAnexosToDelete([]);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPublication(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
  
      // Agregar campos básicos
      formData.append('titulo', editedPublication.titulo);
      formData.append('tipoPublicacion', editedPublication.tipoPublicacion);
      formData.append('fecha', editedPublication.fecha);
      formData.append('estado', editedPublication.estado);
      formData.append('resumen', editedPublication.resumen);
      formData.append('idioma', editedPublication.idioma);
  
      // Agregar proyecto
      formData.append('proyecto', editedPublication.proyecto._id);
  
      // Agregar autores
      const autoresIds = editedPublication.autores.map((autor) => autor._id);
      formData.append('autores', JSON.stringify(autoresIds));
  
      // Agregar palabras clave
      formData.append('palabrasClave', JSON.stringify(editedPublication.palabrasClave));

      // Agregar nuevos anexos
      newAnexos.forEach((anexo) => {
        formData.append('anexos', anexo);
      });

      // Enviar los anexos existentes (los que no se eliminaron)
      formData.append('existingAnexos', JSON.stringify(existingAnexos));
    
      // Enviar la solicitud de actualización
      const result = await putData(`publications/admin`, id, formData);
      setPublication(result.publication);
      setEditedPublication(result.publication);
      setIsEditing(false);
      setError(null);
      AlertComponent.success('Publicación actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la publicación', error);
      let errorMessage = 'Error al actualizar la publicación';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      AlertComponent.error(errorMessage);
    }
  };

  const handleRestore = async () => {
    try {
      await putData('publications/restore', id, {});
      AlertComponent.success("Publicación restaurada con éxito");
      navigate('/admin/publicaciones');
    } catch (error) {
      console.error("Error al restaurar la publicación", error);
      AlertComponent.error("Error al restaurar la publicación");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">
            {isEditing ? 'Editar Publicación' : 'Detalles de la Publicación'}
          </Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}

          <AdmPublicationForm
            publication={isEditing ? editedPublication : publication}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            proyectos={proyectos}
          />

          <AdmPubAuthorsForm
            autores={isEditing ? editedPublication.autores : publication.autores}
            isEditing={isEditing}
            usuarios={usuarios}
            setEditedPublication={setEditedPublication}
          />

          <AdmPubAnexosForm
            existingAnexos={existingAnexos}
            newAnexos={newAnexos}
            setNewAnexos={setNewAnexos}
            anexosToDelete={anexosToDelete}
            setAnexosToDelete={setAnexosToDelete}
            isEditing={isEditing}
          />

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
};

export default AdmEditPublication;