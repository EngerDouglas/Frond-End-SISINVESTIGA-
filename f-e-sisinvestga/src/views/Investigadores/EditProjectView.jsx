import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getDataById, putData } from "../../services/apiServices";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/GestionProyectos/AddEditProjectView.css";

const EditProjectView = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [presupuesto, setPresupuesto] = useState(0);
  const [estado, setEstado] = useState("Planeado");
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [hitos, setHitos] = useState([{ nombre: "", fecha: new Date() }]);
  const [recursos, setRecursos] = useState([""]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getDataById("projects", id);
        setNombre(project.nombre);
        setDescripcion(project.descripcion);
        setObjetivos(project.objetivos);
        setPresupuesto(project.presupuesto);
        setEstado(project.estado);
        setFechaInicio(new Date(project.cronograma.fechaInicio));
        setFechaFin(new Date(project.cronograma.fechaFin));
        setHitos(project.hitos);
        setRecursos(project.recursos);
      } catch (error) {
        console.error("Error al cargar el proyecto", error);
        AlertComponent.error("Error al cargar el proyecto");
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = {
      nombre,
      descripcion,
      objetivos,
      presupuesto,
      estado,
      cronograma: { fechaInicio, fechaFin },
      hitos,
      recursos,
    };

    try {
      await putData('projects', id, updatedProject);
      AlertComponent.success("Proyecto actualizado exitosamente");
      navigate("/proyectos"); // Redirigir a la lista de proyectos
    } catch (error) {
      console.error("Error al actualizar el proyecto", error);
      AlertComponent.error("Error al actualizar el proyecto");
    }
  };

  return (
    <div className="add-edit-project-view">
      <h2>Editar Proyecto</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre del Proyecto</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>

        <label>Objetivos</label>
        <textarea
          value={objetivos}
          onChange={(e) => setObjetivos(e.target.value)}
        ></textarea>

        <label>Presupuesto</label>
        <input
          type="number"
          value={presupuesto}
          onChange={(e) => setPresupuesto(e.target.value)}
          required
        />

        <label>Estado</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Planeado">Planeado</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <label>Fecha de Inicio</label>
        <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
          required
        />

        <label>Fecha de Fin</label>
        <DatePicker
          selected={fechaFin}
          onChange={(date) => setFechaFin(date)}
          required
        />

        <label>Hitos</label>
        {hitos.map((hito, index) => (
          <div key={index} className="hito-group">
            <input
              type="text"
              value={hito.nombre}
              onChange={(e) =>
                setHitos(
                  hitos.map((h, i) =>
                    i === index ? { ...h, nombre: e.target.value } : h
                  )
                )
              }
              required
            />
            <DatePicker
              selected={hito.fecha}
              onChange={(date) =>
                setHitos(
                  hitos.map((h, i) => (i === index ? { ...h, fecha: date } : h))
                )
              }
              required
            />
          </div>
        ))}
        <button type="submit" className="save-btn">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default EditProjectView;
