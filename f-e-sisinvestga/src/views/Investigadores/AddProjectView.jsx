import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/GestionProyectos/AddProjectView.css";

const AddProjectView = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    presupuesto: 0,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    hitos: [{ nombre: "", fecha: new Date() }],
    recursos: [""],
  });

  const navigate = useNavigate();

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejo de fechas
  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  // Agregar nuevo hito
  const addHito = () => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: [...prevData.hitos, { nombre: "", fecha: new Date() }],
    }));
  };

  // Manejo de cambios en hitos
  const handleHitoChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      hitos: prevData.hitos.map((hito, i) =>
        i === index ? { ...hito, [field]: value } : hito
      ),
    }));
  };

  // Agregar nuevo recurso
  const addRecurso = () => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: [...prevData.recursos, ""],
    }));
  };

  // Manejo de cambios en recursos
  const handleRecursoChange = (index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      recursos: prevData.recursos.map((recurso, i) =>
        i === index ? value : recurso
      ),
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Asegúrate de enviar las fechas correctamente en formato ISO
    const newProject = {
      ...formData,
      cronograma: {
        fechaInicio: formData.fechaInicio.toISOString(), // Convertir la fecha a ISO
        fechaFin: formData.fechaFin.toISOString(), // Convertir la fecha a ISO
      },
      hitos: formData.hitos.map((hito) => ({
        nombre: hito.nombre,
        fecha: hito.fecha.toISOString(), // Convertir cada fecha de hito a ISO
      })),
    };

    try {
      await postData("projects", newProject);
      AlertComponent.success("Proyecto agregado exitosamente");
      navigate("/proyectos");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error al agregar el proyecto.";
      AlertComponent.error(errorMessage);
      console.error("Error al agregar el proyecto:", error);
    }
  };

  return (
    <>
      <NavInvestigator />
      <div className="add-project-view-container">
        <div className="container">
          <h2>Agregar Proyecto</h2>
          <form onSubmit={handleSubmit}>
            {/* Nombre del proyecto */}
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

            {/* Descripción */}
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

            {/* Objetivos */}
            <div className="form-group">
              <label htmlFor="objetivos">Objetivos</label>
              <textarea
                id="objetivos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Presupuesto */}
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

            {/* Fecha de inicio */}
            <div className="form-group">
              <label>Fecha de Inicio</label>
              <DatePicker
                selected={formData.fechaInicio}
                onChange={(date) => handleDateChange("fechaInicio", date)}
                required
              />
            </div>

            {/* Fecha de fin */}
            <div className="form-group">
              <label>Fecha de Fin</label>
              <DatePicker
                selected={formData.fechaFin}
                onChange={(date) => handleDateChange("fechaFin", date)}
                required
              />
            </div>

            {/* Hitos */}
            <div className="form-group">
              <label>Hitos</label>
              {formData.hitos.map((hito, index) => (
                <div key={index} className="hito-group">
                  <input
                    type="text"
                    placeholder="Nombre del hito"
                    value={hito.nombre}
                    onChange={(e) =>
                      handleHitoChange(index, "nombre", e.target.value)
                    }
                    required
                  />
                  <DatePicker
                    selected={hito.fecha}
                    onChange={(date) => handleHitoChange(index, "fecha", date)}
                    required
                  />
                </div>
              ))}
              <button type="button" className="add-hito-btn" onClick={addHito}>
                Añadir Hito
              </button>
            </div>

            {/* Recursos */}
            <div className="form-group">
              <label>Recursos</label>
              {formData.recursos.map((recurso, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Recurso"
                  value={recurso}
                  onChange={(e) => handleRecursoChange(index, e.target.value)}
                  required
                />
              ))}
              <button
                type="button"
                className="add-hito-btn"
                onClick={addRecurso}
              >
                Añadir Recurso
              </button>
            </div>

            {/* Botón Guardar */}
            <button type="submit" className="save-btn">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProjectView;
