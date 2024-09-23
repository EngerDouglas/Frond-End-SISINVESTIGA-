import React, { useState } from 'react';
import '../../css/componentes/GestionProyectos/RegistroInvestigador.css';
import Nav from '../Comunes/Nav';

function RegistroInvestigador({ onAdd }) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [especializacion, setEspecializacion] = useState('');
    const [responsabilidades, setResponsabilidades] = useState('');
    const [responsabilidadesList, setResponsabilidadesList] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            nombre,
            apellido,
            email,
            password,
            especializacion,
            responsabilidades: responsabilidadesList,
        });
        resetForm();
    };

    const resetForm = () => {
        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');
        setEspecializacion('');
        setResponsabilidades('');
        setResponsabilidadesList([]);
    };

    const addResponsabilidad = (e) => {
        e.preventDefault();
        if (responsabilidades) {
            setResponsabilidadesList([...responsabilidadesList, responsabilidades]);
            setResponsabilidades('');
        }
    };

    const removeResponsabilidad = (index) => {
        const newList = responsabilidadesList.filter((_, i) => i !== index);
        setResponsabilidadesList(newList);
    };

    return (
        <>
            <Nav></Nav>
              <div className="registro-container">
            <h2>Registro de Investigador</h2>
            <form className="registro-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Especialización"
                    value={especializacion}
                    onChange={(e) => setEspecializacion(e.target.value)}
                    required
                />
                <div className="responsabilidades-container">
                    <input
                        type="text"
                        placeholder="Responsabilidad"
                        value={responsabilidades}
                        onChange={(e) => setResponsabilidades(e.target.value)}
                    />
                    <button onClick={addResponsabilidad} type="button">Agregar</button>
                </div>
                <ul className="responsabilidades-list">
                    {responsabilidadesList.map((resp, index) => (
                        <li key={index}>
                            {resp}
                            <button onClick={() => removeResponsabilidad(index)} type="button" className="remove-btn">Eliminar</button>
                        </li>
                    ))}
                </ul>
                <button type="submit">Registrar Investigador</button>
            </form>
        </div>

        </>
      
    );
}

export default RegistroInvestigador;
