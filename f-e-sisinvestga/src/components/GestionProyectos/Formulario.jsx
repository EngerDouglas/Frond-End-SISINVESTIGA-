import React, { useState } from 'react';
import '../../css/componentes/GestionProyectos/Formulario.css';

const Formulario = ({ agregarProyecto }) => {
  const [proyectoDatos, setProyectoDatos] = useState({
    nombre: "", 
    descripcion: "",
    objetivos: "",
    presupuesto: "",
    fechaInicio: "",
    fechaLimite: "",
    investigadores: [],  
    hitos: [{ nombre: "", fecha: "" }], 
    recursos: [""]
  });

  const [sugerencias, setSugerencias] = useState([]); 
  const [nuevoInvestigador, setNuevoInvestigador] = useState(""); 

  useEffect(() => {
    const obtenerInvestigadores = async () => {
      try {
        const response = await fetch('/api/investigadores');
        const data = await response.json();
        setSugerencias(data.investigadores); 
      } catch (error) {
        console.error("Error al obtener investigadores:", error);
      }
    };

    obtenerInvestigadores();
  }, []); 

  const manejoCambios = (e) => {
    const { name, value } = e.target;
    setProyectoDatos({
      ...proyectoDatos,
      [name]: value
    });
  };

  const agregarInvestigador = (investigador) => {
    if (!proyectoDatos.investigadores.includes(investigador)) {
      setProyectoDatos((prev) => ({
        ...prev,
        investigadores: [...prev.investigadores, investigador]
      }));
    }
    setNuevoInvestigador(""); 
  };

  const manejarNuevoInvestigadorKeyDown = (e) => {
    if (e.key === 'Enter' && nuevoInvestigador) {
      agregarInvestigador(nuevoInvestigador);
    }
  };

  const manejarSugerenciaClick = (investigador) => {
    agregarInvestigador(investigador);
  };

  const eliminarInvestigador = (investigador) => {
    setProyectoDatos((prev) => ({
      ...prev,
      investigadores: prev.investigadores.filter(i => i !== investigador)
    }));
  };

  const manejoHitosCambios = (e, index) => {
    const { name, value } = e.target;
    const nuevosHitos = [...proyectoDatos.hitos];
    nuevosHitos[index] = {
      ...nuevosHitos[index],
      [name]: value
    };
    setProyectoDatos({
      ...proyectoDatos,
      hitos: nuevosHitos
    });
  };

  const agregarHito = () => {
    setProyectoDatos({
      ...proyectoDatos,
      hitos: [...proyectoDatos.hitos, { nombre: "", fecha: "" }]
    });
  };

  const manejoRecursosCambios = (e, index) => {
    const { value } = e.target;
    const nuevosRecursos = [...proyectoDatos.recursos];
    nuevosRecursos[index] = value;
    setProyectoDatos({
      ...proyectoDatos,
      recursos: nuevosRecursos
    });
  };

  const agregarRecurso = () => {
    setProyectoDatos({
      ...proyectoDatos,
      recursos: [...proyectoDatos.recursos, ""]
    });
  };

  const manejoSubida = async (e) => {
    e.preventDefault();

    const cronograma = {
      fechaInicio: proyectoDatos.fechaInicio,
      fechaFin: proyectoDatos.fechaLimite
    };

    const nuevoProyecto = {
      nombre: proyectoDatos.nombre,
      descripcion: proyectoDatos.descripcion,
      objetivos: proyectoDatos.objetivos,
      presupuesto: proyectoDatos.presupuesto,
      investigadores: proyectoDatos.investigadores,
      cronograma,
      hitos: proyectoDatos.hitos,
      recursos: proyectoDatos.recursos
    };

    try {
      const response = await fetch('/api/proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProyecto)
      });

      const data = await response.json();
      if (response.ok) {
        agregarProyecto(data.proyecto); 
        setProyectoDatos({
          nombre: "",
          descripcion: "",
          objetivos: "",
          presupuesto: "",
          fechaInicio: "",
          fechaLimite: "",
          investigadores: [],
          hitos: [{ nombre: "", fecha: "" }],
          recursos: [""] 
        });
      } else {
        console.error("Error al crear el proyecto:", data);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  return (
    <form onSubmit={manejoSubida} className="form-container">
      <h2>Crear Proyecto</h2>
      <div className="form">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={proyectoDatos.nombre}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={proyectoDatos.descripcion}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Objetivos:</label>
        <textarea
          name="objetivos"
          value={proyectoDatos.objetivos}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Presupuesto:</label>
        <input
          type="number"
          name="presupuesto"
          value={proyectoDatos.presupuesto}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Fecha de Inicio:</label>
        <input
          type="date"
          name="fechaInicio"
          value={proyectoDatos.fechaInicio}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Fecha Límite:</label>
        <input
          type="date"
          name="fechaLimite"
          value={proyectoDatos.fechaLimite}
          onChange={manejoCambios}
        />
      </div>
      <div className="form">
        <label>Investigadores:</label>
        <input
          type="text"
          value={nuevoInvestigador}
          placeholder="Buscar investigadores..."
          onChange={(e) => setNuevoInvestigador(e.target.value)}
          onKeyDown={manejarNuevoInvestigadorKeyDown}
        />
        <ul>
          {sugerencias.filter(i => i.includes(nuevoInvestigador)).map((investigador, index) => (
            <li key={index} onClick={() => manejarSugerenciaClick(investigador)}>
              {investigador}
            </li>
          ))}
        </ul>
        <div>
          <h4>Investigadores Seleccionados:</h4>
          <ul>
            {proyectoDatos.investigadores.map((investigador, index) => (
              <li key={index}>
                {investigador}
                <button type="button" onClick={() => eliminarInvestigador(investigador)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="form">
        <label>Hitos:</label>
        {proyectoDatos.hitos.map((hito, index) => (
          <div key={index}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del hito"
              value={hito.nombre}
              onChange={(e) => manejoHitosCambios(e, index)}
            />
            <input
              type="date"
              name="fecha"
              value={hito.fecha}
              onChange={(e) => manejoHitosCambios(e, index)}
            />
          </div>
        ))}
        <button type="button" onClick={agregarHito}>Agregar Hito</button>
      </div>
      <div className="form">
        <label>Recursos:</label>
        {proyectoDatos.recursos.map((recurso, index) => (
          <div key={index}>
            <input
              type="text"
              value={recurso}
              onChange={(e) => manejoRecursosCambios(e, index)}
            />
          </div>
        ))}
        <button type="button" onClick={agregarRecurso}>Agregar Recurso</button>
      </div>
      <button type="submit" className="submit-btn">Crear</button>
    </form>
  );
};

export default Formulario;