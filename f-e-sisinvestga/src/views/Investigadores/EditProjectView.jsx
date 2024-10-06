import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getUserData, putData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/GestionProyectos/EditProjectView.css";

const EditProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    presupuesto: 0,
    estado: "Planeado", // Este campo será solo lectura
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
            estado: project.estado, // Estado solo lectura
            fechaInicio: new Date(project.cronograma.fechaInicio),
            fechaFin: new Date(project.cronograma.fechaFin),
            hitos:
              project.hitos.length > 0
                ? project.hitos
                : [{ nombre: "", fecha: new Date() }],
            recursos: project.recursos.length > 0 ? project.recursos : [""],
          });
        }
      } catch (error) {
        let errorMessage = "Ocurrió un error al cargar los datos del proyecto.";
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

    fetchProject();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await putData("projects", id, formData);
      AlertComponent.success("Proyecto actualizado exitosamente.");
      navigate("/invest/proyectos");
    } catch (error) {
      let errorMessage =
        "Ocurrió un error al actualizar el Proyecto.";
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
      <div className="edit-project-view-container">
        <div className="container">
          <h2>Editar Proyecto</h2>
          <form onSubmit={handleSubmit}>
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
                value={formData.estado} // Campo solo lectura
                readOnly
              />
            </div>

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

            <div className="form-group">
              <label>Hitos</label>
              {formData.hitos.map((hito, index) => (
                <div key={index} className="hito-group">
                  <input
                    type="text"
                    value={hito.nombre}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        hitos: prevData.hitos.map((h, i) =>
                          i === index ? { ...h, nombre: e.target.value } : h
                        ),
                      }))
                    }
                    required
                  />
                  <DatePicker
                    selected={hito.fecha}
                    onChange={(date) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        hitos: prevData.hitos.map((h, i) =>
                          i === index ? { ...h, fecha: date } : h
                        ),
                      }))
                    }
                    required
                  />
                </div>
              ))}
              <button type="button" className="add-hito-btn" onClick={addHito}>
                Añadir Hito
              </button>
            </div>

            <div className="form-group">
              <label>Recursos</label>
              {formData.recursos.map((recurso, index) => (
                <input
                  key={index}
                  type="text"
                  value={recurso}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      recursos: prevData.recursos.map((r, i) =>
                        i === index ? e.target.value : r
                      ),
                    }))
                  }
                  required
                />
              ))}
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

export default EditProjectView;
