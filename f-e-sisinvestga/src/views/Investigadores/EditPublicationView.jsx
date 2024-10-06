import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getDataById, getUserData, putData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/Publicaciones/EditPublicationView.css";

const EditPublicationView = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titulo: "",
    fecha: new Date(),
    proyecto: "",
    revista: "",
    resumen: "",
    palabrasClave: "",
    tipoPublicacion: "",
    idioma: "Español",
    anexos: "",
  });

  const [proyectoNombre, setProyectoNombre] = useState("");
  const [tiposPublicacion, setTiposPublicacion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener los tipos de publicación
        const userPublicationsData = await getUserData("publications");
        setTiposPublicacion(userPublicationsData.tiposPublicacion || []);

        // Obtener los datos de la publicación específica
        const publicationData = await getDataById('publications/getpublication', id);
        if (publicationData) {
          setFormData({
            titulo: publicationData.titulo,
            fecha: new Date(publicationData.fecha),
            proyecto: publicationData.proyecto?._id || "",
            revista: publicationData.revista,
            resumen: publicationData.resumen,
            palabrasClave: publicationData.palabrasClave.join(", "),
            tipoPublicacion: publicationData.tipoPublicacion,
            idioma: publicationData.idioma,
            anexos: publicationData.anexos.join(", "),
          });
          setProyectoNombre(publicationData.proyecto?.nombre || "No asociado");
        }
      } catch (error) {
        let errorMessage =
          "Ocurrió un error al cargar los datos al formulario.";
        let detailedErrors = [];

        try {
          // Intentamos analizar el error recibido del backend
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.message;
          detailedErrors = parsedError.errors || [];
        } catch (parseError) {
          // Si no se pudo analizar, usamos el mensaje de error general
          errorMessage = error.message;
        }
        AlertComponent.error(errorMessage);
        detailedErrors.forEach((err) => AlertComponent.error(err));
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      fecha: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPublication = {
      ...formData,
      palabrasClave: formData.palabrasClave.split(",").map((p) => p.trim()),
      anexos: formData.anexos.split(",").map((a) => a.trim()),
    };

    try {
      await putData("publications", id, updatedPublication);
      AlertComponent.success("Publicación actualizada exitosamente.");
      navigate("/publicaciones");
    } catch (error) {
      let errorMessage =
        "Ocurrió un error al tratar de actualizar la publicacion.";
      let detailedErrors = [];

      try {
        // Intentamos analizar el error recibido del backend
        const parsedError = JSON.parse(error.message);
        errorMessage = parsedError.message;
        detailedErrors = parsedError.errors || [];
      } catch (parseError) {
        // Si no se pudo analizar, usamos el mensaje de error general
        errorMessage = error.message;
      }
      AlertComponent.error(errorMessage);
      detailedErrors.forEach((err) => AlertComponent.error(err));
    }
  };

  return (
    <>
      <NavInvestigator />
      <div className="edit-publication-view-container">
        <div className="container">
          <h2>Editar Publicación</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Título de la Publicación</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Publicación</label>
              <DatePicker
                selected={formData.fecha}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="proyecto">Proyecto Asociado</label>
              <input
                type="text"
                id="proyecto"
                name="proyecto"
                value={proyectoNombre || "No asociado"} // Mostrar el nombre del proyecto
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="revista">Revista</label>
              <input
                type="text"
                id="revista"
                name="revista"
                value={formData.revista}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resumen">Resumen</label>
              <textarea
                id="resumen"
                name="resumen"
                value={formData.resumen}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="palabrasClave">
                Palabras Clave (separadas por coma)
              </label>
              <input
                type="text"
                id="palabrasClave"
                name="palabrasClave"
                value={formData.palabrasClave}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoPublicacion">Tipo de Publicación</label>
              <select
                id="tipoPublicacion"
                name="tipoPublicacion"
                value={formData.tipoPublicacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Tipo de Publicación</option>
                {tiposPublicacion.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idioma">Idioma</label>
              <input
                type="text"
                id="idioma"
                name="idioma"
                value={formData.idioma}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="anexos">Anexos (URLs separadas por coma)</label>
              <input
                type="text"
                id="anexos"
                name="anexos"
                value={formData.anexos}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-btn">
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPublicationView;
