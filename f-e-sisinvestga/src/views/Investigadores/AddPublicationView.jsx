import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { postData, getUserData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/componentes/Publicaciones/AddPublicationView.css";

const AddPublicationView = () => {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [proyecto, setProyecto] = useState("");
  const [revista, setRevista] = useState("");
  const [resumen, setResumen] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");
  const [tipoPublicacion, setTipoPublicacion] = useState("");
  const [idioma, setIdioma] = useState("Español");
  const [anexos, setAnexos] = useState("");
  const [proyectos, setProyectos] = useState([]); // Proyectos obtenidos del usuario
  const [tiposPublicacion, setTiposPublicacion] = useState([]); // Tipos de publicación
  const navigate = useNavigate();

  // Cargamos los proyectos y tipos de publicación al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener proyectos asociados al usuario
        const proyectosData = await getUserData("users");
        setProyectos(proyectosData.data || []);

        // Obtener los tipos de publicación desde el backend
        const tiposData = await getUserData("publications"); // Ajusta este endpoint según tu API
        setTiposPublicacion(tiposData.data || []);
      } catch (error) {
        AlertComponent.error("Error al cargar los datos del formulario");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPublication = {
      titulo,
      fecha,
      proyecto,
      revista,
      resumen,
      palabrasClave: palabrasClave.split(","),
      tipoPublicacion,
      idioma,
      anexos: anexos.split(","),
    };

    try {
      await postData("publications", newPublication);
      AlertComponent.success("Publicación agregada exitosamente");
      navigate("/publicaciones");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error al agregar la publicación";
      AlertComponent.error(errorMessage);
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
              <label>Título de la Publicación</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Publicación</label>
              <DatePicker
                selected={fecha}
                onChange={(date) => setFecha(date)}
                required
              />
            </div>

            <div className="form-group">
              <label>Proyecto Asociado</label>
              <select
                value={proyecto}
                onChange={(e) => setProyecto(e.target.value)}
                required
              >
                <option value="">Seleccionar Proyecto</option>
                {proyectos.map((proyecto, index) => (
                  <option key={index} value={proyecto.nombre}>
                    {proyecto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Revista</label>
              <input
                type="text"
                value={revista}
                onChange={(e) => setRevista(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Resumen</label>
              <textarea
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Palabras Clave (separadas por coma)</label>
              <input
                type="text"
                value={palabrasClave}
                onChange={(e) => setPalabrasClave(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tipo de Publicación</label>
              <select
                value={tipoPublicacion}
                onChange={(e) => setTipoPublicacion(e.target.value)}
                required
              >
                <option value="">Seleccionar Tipo de Publicación</option>
                {tiposPublicacion.map((tipo, index) => (
                  <option key={index} value={tipo.tipoPublicacion}>
                    {tipo.tipoPublicacion}
                    {/* Asegúrate de que `tipo.nombre` sea una cadena */}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Idioma</label>
              <input
                type="text"
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Anexos (URLs separadas por coma)</label>
              <input
                type="text"
                value={anexos}
                onChange={(e) => setAnexos(e.target.value)}
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
