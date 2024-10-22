import React, { useState } from 'react';
import '../css/componentes/confprofileadmin.css';

const AdmProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    id: '66d9a3d28811e44aea8b1dd6',
    nombre: 'Carlos Alberto',
    apellido: 'Castillo Garcia',
    email: 'castilloz671@gmail.com',
    password: '$2a$08$/Wk5WcH7dMz1csqsej18TO4FJTTYH6BVLMFRVVMq3r67.LcvISeQK',
    especializacion: 'Ingeniero Quimico',
    responsabilidades: ['Desarrollar Materiales', 'Probar Productos', 'Crear Formulas'],
    role: '66d77649d458301a4aba678c',
    createdAt: '2024-09-05T12:28:02.312+00:00',
    tokens: [],
    __v: 98,
    isDisabled: false,
    updatedAt: '2024-10-17T13:32:26.792+00:00',
    fotoPerfil: 'https://firebasestorage.googleapis.com/v0/b/sisinvestiga.appspot.com/o/profile%2F3f0b1e07-8b60-4e07-b670-836f37df7a6e-8.jpeg?alt=media',
    isVerified: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, fotoPerfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(profileData);
  };

  return (
    <div className="profile-container">
      <h1>Profile Overview</h1>

      {/* Contenedor de la foto de perfil con el botón */}
      <div className="profile-picture-container">
        <div className="profile-picture-circle">
          <img src={profileData.fotoPerfil} alt="Profile" className="profile-picture" />
        </div>
        <label className="change-picture-btn">
          Change Photo
          <input
            type="file"
            accept=".svg, .png, .jpg, .gif"
            onChange={handlePictureChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          className="form-input"
          name="nombre"
          value={profileData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="form-input"
          name="apellido"
          value={profileData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="form-input"
          name="email"
          value={profileData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          name="password"
          value={profileData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Especialización"
          className="form-input"
          name="especializacion"
          value={profileData.especializacion}
          onChange={handleChange}
          required
        />

        <textarea
          placeholder="Responsabilidades"
          className="form-textarea"
          name="responsabilidades"
          value={profileData.responsabilidades.join(', ')}
          onChange={handleChange}
        ></textarea>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="isVerified"
            name="isVerified"
            checked={profileData.isVerified}
            onChange={(e) => setProfileData({ ...profileData, isVerified: e.target.checked })}
          />
          <label htmlFor="isVerified">Verified Profile</label>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AdmProfileSettings;
