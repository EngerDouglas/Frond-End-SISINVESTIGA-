import React, { useState } from "react";
import "../../../css/componentes/Seguridad/Register.css";
import AlertComponent from "../../Comunes/AlertComponent";
import ucsdImage from "../../../assets/img/ucsd.webp";
import logo from "../../../assets/img/LogoUCSD.jpg";
import { postData } from "../../../services/apiServices";
import { Link } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [responsabilidades, setResponsabilidades] = useState("");
  const [responsabilidadesList, setResponsabilidadesList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData("users/register", {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        especializacion: especializacion,
        responsabilidades: responsabilidadesList,
      });

      AlertComponent.success(
        "El investigador ha sido registrado correctamente."
      );

      resetForm();
    } catch (error) {
      if (error.response && error.response.data) {
        // Verificamos si hay múltiples errores devueltos (por ejemplo, con express-validator)
        const errorMessages = error.response.data.errors || [
          error.response.data.error,
        ];

        // Mostramos cada error individual usando un alert de error
        errorMessages.forEach((err) => AlertComponent.error(err.msg || err));
      } else {
        // Si no hay un error claro, mostramos un mensaje genérico
        AlertComponent.error(
          "Ocurrió un error durante el registro. Inténtalo de nuevo."
        );
      }
    }
  };

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setPassword("");
    setEspecializacion("");
    setResponsabilidades("");
    setResponsabilidadesList([]);
  };

  const addResponsabilidad = (e) => {
    e.preventDefault();
    if (responsabilidades) {
      setResponsabilidadesList([...responsabilidadesList, responsabilidades]);
      setResponsabilidades("");
    }
  };

  const removeResponsabilidad = (index) => {
    const newList = responsabilidadesList.filter((_, i) => i !== index);
    setResponsabilidadesList(newList);
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img src={ucsdImage} alt="UCSD" className="register-background" />
      </div>
      <div className="register-right">
        <div className="register-container">
          <Link to="/">
            <img src={logo} alt="UCSD Logo" className="register-logo" />
          </Link>
          <h2>Registro de Investigador</h2>
          <form className="register-form" onSubmit={handleSubmit}>
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
              <button
                className="add-btn"
                onClick={addResponsabilidad}
                type="button"
              >
                Agregar
              </button>
            </div>
            <ul className="responsabilidades-list">
              {responsabilidadesList.map((resp, index) => (
                <li key={index}>
                  <span className="responsabilidad-text">{resp}</span>
                  <button
                    onClick={() => removeResponsabilidad(index)}
                    type="button"
                    className="remove-btn"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <button type="submit" className="submit-btn">
              Registrar Investigador
            </button>
          </form>
          <div className="signin-option">
            <span>¿Ya tienes cuenta?</span>{" "}
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </div>
          <footer className="footer">
            © 2024 Universidad Católica Santo Domingo - Todos los Derechos
            Reservados
          </footer>
        </div>
      </div>
    </div>
  );
}
