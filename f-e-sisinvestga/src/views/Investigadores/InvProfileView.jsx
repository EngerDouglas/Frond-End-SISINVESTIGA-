import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAllUser } from "../../features/auth/authSlice";
import PasswordChecklist from "react-password-checklist";
import { getUserData, putSelfData } from "../../services/apiServices"; // Tu apiService
import NavInvestigator from "../../components/Comunes/NavInvestigator";
import AlertComponent from "../../components/Comunes/AlertComponent";
import "../../css/componentes/GestionInvestigadores/InvProfileView.css";

const InvProfileView = () => {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    especializacion: "",
    responsabilidades: [], // Inicializamos responsabilidades como un array vacío
    fotoPerfil: "",
  });
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData("users");
        setUser({ ...data, responsabilidades: data.responsabilidades || [], });
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
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = error.response.data.errors || [
          error.response.data.error,
        ];
        errorMessages.forEach((err) => AlertComponent.error(err.msg || err));
      } else {
        AlertComponent.error("Error al actualizar el perfil");
        setIsUpdating(false);
      }
    }
  };

  const handleLogoutAllSessions = () => {
    try {
      dispatch(logoutAllUser()).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(
        "Error al cerrar las sesiones en todos los dispositivos:",
        error
      );
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
            <label className="profile-label">Subir nueva foto</label>
            <input type="file" className="profile-input" />
          </div>
          <form onSubmit={handleUpdateUser} className="profile-form">
            <label>Nombre</label>
            <input
              type="text"
              value={user.nombre}
              onChange={(e) => setUser({ ...user, nombre: e.target.value })}
              required
            />

            <label>Apellido</label>
            <input
              type="text"
              value={user.apellido}
              onChange={(e) => setUser({ ...user, apellido: e.target.value })}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />

            <label>Especialización</label>
            <input
              type="text"
              value={user.especializacion}
              onChange={(e) =>
                setUser({ ...user, especializacion: e.target.value })
              }
              required
            />

            <label>Responsabilidades</label>
            <textarea
              value={user.responsabilidades.join(", ")}
              onChange={(e) =>
                setUser({
                  ...user,
                  responsabilidades: e.target.value.split(", "),
                })
              }
              required
            />

            {/* Cambiar Contraseña */}
            <label>Cambiar Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital"]}
              minLength={8}
              value={newPassword}
              valueAgain={confirmPassword}
              onChange={(isValid) => console.log(isValid)}
              messages={{
                minLength: "La contraseña tiene más de 8 caracteres.",
                specialChar: "La contraseña tiene caracteres especiales.",
                number: "La contraseña tiene un número.",
                capital: "La contraseña tiene una letra mayúscula.",
                match: "Las contraseñas coinciden.",
              }}
            />

            <button type="submit" className="save-btn" disabled={isUpdating}>
              {isUpdating ? "Actualizando..." : "Guardar cambios"}
            </button>
          </form>

          {/* Cerrar sesiones */}
          <button className="logout-all-btn" onClick={handleLogoutAllSessions}>
            Cerrar sesiones en todos los dispositivos
          </button>
        </div>
      </div>
    </>
  );
};

export default InvProfileView;
