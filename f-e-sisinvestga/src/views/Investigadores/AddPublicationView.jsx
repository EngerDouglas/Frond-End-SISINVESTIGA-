import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData, getUserData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/Publicaciones/AddPublicationView.css";

const AddPublicationView = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [proyectos, setProyectos] = useState([]);
  const [tiposPublicacion, setTiposPublicacion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectosData = await getUserData("projects");
        setProyectos(proyectosData.data || []);

        const tiposData = await getUserData("publications");
        setTiposPublicacion(tiposData.tiposPublicacion || []);
      } catch (error) {
        handleError(error, "Error al cargar los datos al Formulario");
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
      palabrasClave: formData.palabrasClave.split(",").map((palabra) => palabra.trim()),
      anexos: formData.anexos.split(",").map((anexo) => anexo.trim()),
    };

    try {
      await postData("publications", newPublication);
      AlertComponent.success("Publicación agregada exitosamente");
      navigate("/invest/publicaciones");
    } catch (error) {
      handleError(error, "Ocurrió un error al crear la Publicación.");
    }
  };

  const handleError = (error, defaultMessage) => {
    let errorMessage = defaultMessage;
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
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <>
      <NavInvestigator />
      <div className="add-publication-view-container">
        <div className="wizard-container">
          <h2>Agregar Publicación</h2>
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Información Básica</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Detalles</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Contenido y Anexos</div>
          </div>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="form-step">
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
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
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
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
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
                  <label htmlFor="palabrasClave">Palabras Clave (separadas por coma)</label>
                  <input
                    type="text"
                    id="palabrasClave"
                    name="palabrasClave"
                    value={formData.palabrasClave}
                    onChange={handleChange}
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
              </div>
            )}

            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="nav-btn prev-btn">
                  <FaArrowLeft /> Anterior
                </button>
              )}
              {currentStep < 3 && (
                <button type="button" onClick={nextStep} className="nav-btn next-btn">
                  Siguiente <FaArrowRight />
                </button>
              )}
              {currentStep === 3 && (
                <button type="submit" className="nav-btn save-btn">
                  <FaSave /> Guardar Publicación
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPublicationView;