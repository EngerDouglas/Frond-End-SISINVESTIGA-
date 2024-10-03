import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/GestionProyectos/AddProjectView.css";

const AddProjectView = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [presupuesto, setPresupuesto] = useState(0);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [hitos, setHitos] = useState([{ nombre: "", fecha: new Date() }]);
  const [recursos, setRecursos] = useState([""]);
  const navigate = useNavigate();

  const handleAddHito = () => {
    setHitos([...hitos, { nombre: "", fecha: new Date() }]);
  };

  const handleHitoChange = (index, field, value) => {
    const updatedHitos = hitos.map((hito, i) =>
      i === index ? { ...hito, [field]: value } : hito
    );
    setHitos(updatedHitos);
  };

  const handleAddRecurso = () => {
    setRecursos([...recursos, ""]);
  };

  const handleRecursoChange = (index, value) => {
    const updatedRecursos = recursos.map((recurso, i) =>
      i === index ? value : recurso
    );
    setRecursos(updatedRecursos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject = {
      nombre,
      descripcion,
      objetivos,
      presupuesto,
      cronograma: { fechaInicio, fechaFin },
      hitos,
      recursos,
    };

    try {
      await postData("projects", newProject);
      AlertComponent.success("Proyecto agregado exitosamente");
      navigate("/proyectos");
    } catch (error) {
      console.error("Error al agregar el proyecto", error);
      AlertComponent.error("Error al agregar el proyecto");
    }
  };

  return (
    <>
      <NavInvestigator />
      <div className="add-project-view-container">
        <div className="container">
          <h2>Agregar Proyecto</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Proyecto</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Objetivos</label>
              <textarea
                value={objetivos}
                onChange={(e) => setObjetivos(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Presupuesto</label>
              <input
                type="number"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Inicio</label>
              <DatePicker
                selected={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Fin</label>
              <DatePicker
                selected={fechaFin}
                onChange={(date) => setFechaFin(date)}
                required
              />
            </div>

            <div className="form-group">
              <label>Hitos</label>
              {hitos.map((hito, index) => (
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
              <button
                type="button"
                className="add-hito-btn"
                onClick={handleAddHito}
              >
                Añadir Hito
              </button>
            </div>

            <div className="form-group">
              <label>Recursos</label>
              {recursos.map((recurso, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Recurso"
                  value={recurso}
                  onChange={(e) => handleRecursoChange(index, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="add-hito-btn"
                onClick={handleAddRecurso}
              >
                Añadir Recurso
              </button>
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

export default AddProjectView;
