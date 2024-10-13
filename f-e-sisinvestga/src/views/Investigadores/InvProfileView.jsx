import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAllUser } from "../../features/auth/authSlice";
import PasswordChecklist from "react-password-checklist";
import { getUserData, putSelfData } from "../../services/apiServices";
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import { FaUser, FaEnvelope, FaGraduationCap, FaTasks, FaKey, FaSignOutAlt } from "react-icons/fa";
import "../../css/componentes/GestionInvestigadores/InvProfileView.css";

const InvProfileView = () => {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    especializacion: "",
    responsabilidades: [],
    fotoPerfil: "",
  });
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData("users");
        setUser({ ...data, responsabilidades: data.responsabilidades || [] });
      } catch (error) {
        AlertComponent.error("Error al cargar el perfil del usuario");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const updates = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      especializacion: user.especializacion,
      responsabilidades: user.responsabilidades,
      currentPassword,
      newPassword,
    };

    try {
      await putSelfData("users", updates);
      AlertComponent.success("Perfil actualizado correctamente");
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      let errorMessage = "Error al crear el Proyecto.";
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
      setIsUpdating(false);
    }
  };

  const handleLogoutAllSessions = () => {
    try {
      dispatch(logoutAllUser()).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al cerrar las sesiones en todos los dispositivos:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, fotoPerfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <NavInvestigator />
      <div className="user-profile-container">
        <h2 className="profile-title">Perfil de Usuario</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={user.fotoPerfil || "/default-avatar.png"} alt="Avatar" />
            <label className="profile-label" htmlFor="profile-photo-upload">
              Subir nueva foto
            </label>
            <input
              id="profile-photo-upload"
              type="file"
              className="profile-input"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <form onSubmit={handleUpdateUser} className="profile-form">
            <div className="form-group">
              <FaUser className="form-icon" />
              <input
                type="text"
                value={user.nombre}
                onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                placeholder="Nombre"
                required
              />
            </div>

            <div className="form-group">
              <FaUser className="form-icon" />
              <input
                type="text"
                value={user.apellido}
                onChange={(e) => setUser({ ...user, apellido: e.target.value })}
                placeholder="Apellido"
                required
              />
            </div>

            <div className="form-group">
              <FaEnvelope className="form-icon" />
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <FaGraduationCap className="form-icon" />
              <input
                type="text"
                value={user.especializacion}
                onChange={(e) => setUser({ ...user, especializacion: e.target.value })}
                placeholder="Especialización"
                required
              />
            </div>

            <div className="form-group">
              <FaTasks className="form-icon" />
              <textarea
                value={user.responsabilidades.join(", ")}
                onChange={(e) => setUser({ ...user, responsabilidades: e.target.value.split(", ") })}
                placeholder="Responsabilidades (separadas por coma)"
                required
              />
            </div>

            <h3 className="section-title">Cambiar Contraseña</h3>

            <div className="form-group">
              <FaKey className="form-icon" />
              <input
                type="password"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <FaKey className="form-icon" />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <FaKey className="form-icon" />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={newPassword}
              valueAgain={confirmPassword}
              onChange={(isValid) => setIsPasswordValid(isValid)}
              messages={{
                minLength: "La contraseña tiene al menos 8 caracteres.",
                specialChar: "La contraseña tiene caracteres especiales.",
                number: "La contraseña tiene un número.",
                capital: "La contraseña tiene una letra mayúscula.",
                match: "Las contraseñas coinciden.",
              }}
            />

            <button type="submit" className="save-btn" disabled={isUpdating || (newPassword && !isPasswordValid)}>
              {isUpdating ? "Actualizando..." : "Guardar cambios"}
            </button>
          </form>

          <button className="logout-all-btn" onClick={handleLogoutAllSessions}>
            <FaSignOutAlt /> Cerrar sesiones en todos los dispositivos
          </button>
        </div>
      </div>
    </>
  );
};

export default InvProfileView;