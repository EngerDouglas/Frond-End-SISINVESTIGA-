import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getUserData, putData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import { FaArrowLeft, FaArrowRight, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/GestionProyectos/EditProjectView.css";

const EditProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    presupuesto: 0,
    estado: "Planeado",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    hitos: [{ nombre: "", fecha: new Date() }],
    recursos: [""],
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getUserData("projects");
        const project = projectData.data.find((p) => p._id === id);

        if (project) {
          setFormData({
            nombre: project.nombre,
            descripcion: project.descripcion,
            objetivos: project.objetivos,
            presupuesto: project.presupuesto,
            estado: project.estado,
            fechaInicio: new Date(project.cronograma.fechaInicio),
            fechaFin: new Date(project.cronograma.fechaFin),
            hitos: project.hitos.length > 0
              ? project.hitos.map(h => ({ ...h, fecha: new Date(h.fecha) }))
              : [{ nombre: "", fecha: new Date() }],
            recursos: project.recursos.length > 0 ? project.recursos : [""],
          });
        }
      } catch (error) {
        handleError(error, "Ocurrió un error al cargar los datos del proyecto.");
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const addHito = () => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: [...prevData.hitos, { nombre: "", fecha: new Date() }],
    }));
  };

  const removeHito = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: prevData.hitos.filter((_, i) => i !== index),
    }));
  };

  const handleHitoChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: prevData.hitos.map((hito, i) =>
        i === index ? { ...hito, [field]: value } : hito
      ),
    }));
  };

  const addRecurso = () => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: [...prevData.recursos, ""],
    }));
  };

  const removeRecurso = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: prevData.recursos.filter((_, i) => i !== index),
    }));
  };

  const handleRecursoChange = (index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: prevData.recursos.map((recurso, i) =>
        i === index ? value : recurso
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await putData("projects", id, formData);
      AlertComponent.success("Proyecto actualizado exitosamente.");
      navigate("/invest/proyectos");
    } catch (error) {
      handleError(error, "Ocurrió un error al actualizar el Proyecto.");
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
      <div className="edit-project-view-container">
        <div className="wizard-container">
          <h2>Editar Proyecto</h2>
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Información Básica</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Cronograma</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Hitos y Recursos</div>
          </div>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Proyecto</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="objetivos">Objetivos</label>
                  <textarea
                    id="objetivos"
                    name="objetivos"
                    value={formData.objetivos}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="presupuesto">Presupuesto</label>
                  <input
                    type="number"
                    id="presupuesto"
                    name="presupuesto"
                    value={formData.presupuesto}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado del Proyecto</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <DatePicker
                    selected={formData.fechaInicio}
                    onChange={(date) => handleDateChange("fechaInicio", date)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <DatePicker
                    selected={formData.fechaFin}
                    onChange={(date) => handleDateChange("fechaFin", date)}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <div className="form-group">
                  <label>Hitos</label>
                  {formData.hitos.map((hito, index) => (
                    <div key={index} className="hito-group">
                      <input
                        type="text"
                        placeholder="Nombre del hito"
                        value={hito.nombre}
                        onChange={(e) => handleHitoChange(index, "nombre", e.target.value)}
                        required
                      />
                      <DatePicker
                        selected={hito.fecha}
                        onChange={(date) => handleHitoChange(index, "fecha", date)}
                        required
                      />
                      <button type="button" className="remove-btn" onClick={() => removeHito(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addHito}>
                    <FaPlus /> Añadir Hito
                  </button>
                </div>
                <div className="form-group">
                  <label>Recursos</label>
                  {formData.recursos.map((recurso, index) => (
                    <div key={index} className="recurso-group">
                      <input
                        type="text"
                        placeholder="Recurso"
                        value={recurso}
                        onChange={(e) => handleRecursoChange(index, e.target.value)}
                        required
                      />
                      <button type="button" className="remove-btn" onClick={() => removeRecurso(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addRecurso}>
                    <FaPlus /> Añadir Recurso
                  </button>
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
                  <FaSave /> Guardar Cambios
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProjectView;