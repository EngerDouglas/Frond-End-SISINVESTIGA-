import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData, getUserData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/Publicaciones/AddPublicationView.css";

const AddPublicationView = () => {
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
  const [proyectos, setProyectos] = useState([]); // Proyectos obtenidos del usuario
  const [tiposPublicacion, setTiposPublicacion] = useState([]); // Tipos de publicación
  const navigate = useNavigate();

  // Cargamos los proyectos y tipos de publicación al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener proyectos asociados al usuario
        const proyectosData = await getUserData("projects");
        setProyectos(proyectosData.data || []);

        // Obtener los tipos de publicación desde el backend
        const tiposData = await getUserData("publications"); // Ajusta este endpoint según tu API
        setTiposPublicacion(tiposData.data || []);
        setTiposPublicacion(tiposData.tiposPublicacion || []);
      } catch (error) {
        let errorMessage = "Error al cargar los datos al Formulario";
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
  }, []);

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
    const newPublication = {
      ...formData,
      palabrasClave: formData.palabrasClave
        .split(",")
        .map((palabra) => palabra.trim()),
      anexos: formData.anexos.split(",").map((anexo) => anexo.trim()),
    };

    try {
      await postData("publications", newPublication);
      AlertComponent.success("Publicación agregada exitosamente");
      navigate("/publicaciones");
    } catch (error) {
      let errorMessage =
        "Ocurrió un error al crear la Publicacion.";
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
      <div className="add-publication-view-container">
        <div className="container">
          <h2>Agregar Publicación</h2>
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
              <select
                id="proyecto"
                name="proyecto"
                value={formData.proyecto}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Proyecto</option>
                {proyectos.map((proyecto) => (
                  <option key={proyecto._id} value={proyecto._id}>
                    {proyecto.nombre}
                  </option>
                ))}
              </select>
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
                    {/* Asegúrate de que `tipo.nombre` sea una cadena */}
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
              Guardar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPublicationView;
