import React, { useState } from 'react';
import '../css/componentes/confprofileadmin.css';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Carlos Alberto',
    lastName: 'Castillo Garcia',
    email: 'castilloz671@gmail.com',
    phone: '',
    bio: '',
    projectDescription: '',
    skills: [
      'Desarrollar Materiales',
      'Probar Productos',
      'Crear Formulas.'
    ],
    employmentTypes: ['Full-Time', 'Part-Time', 'Freelance', 'Internship'],
    profilePicture: 'https://firebasestorage.googleapis.com/v0/b/sisinvestiga.appspot.com/o/profile%2F3f0b1e07-8b60-4e07-b670-836f37df7a6e-8.jpeg?alt=media',
    newsletter: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(profileData);
  };

  return (
    <div className="profile-container">
      <h1>Profile Overview</h1>
      
      {/* Contenedor de la foto de perfil */}
      <div className="profile-picture-circle">
        <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          className="form-input"
          name="firstName"
          value={profileData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="form-input"
          name="lastName"
          value={profileData.lastName}
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
          type="tel"
          placeholder="Phone Number"
          className="form-input"
          name="phone"
          value={profileData.phone}
          onChange={handleChange}
        />

        <textarea
          placeholder="Short Bio"
          className="form-textarea"
          name="bio"
          value={profileData.bio}
          onChange={handleChange}
        ></textarea>

        <textarea
          placeholder="Project description"
          className="form-textarea project-description"
          name="projectDescription"
          value={profileData.projectDescription}
          onChange={handleChange}
        ></textarea>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={profileData.newsletter}
            onChange={handleChange}
          />
          <label htmlFor="newsletter">Subscribe to newsletter</label>
        </div>

        <div className="skills-section">
          <h3>Skills:</h3>
          <div className="skills-container">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="skill-card">{skill}</div>
            ))}
          </div>
        </div>

        <div className="employment-type-section">
          <h3>Employment Type:</h3>
          <div className="employment-types">
            {profileData.employmentTypes.map((type, index) => (
              <div key={index} className="employment-card">{type}</div>
            ))}
          </div>
        </div>

        <div className="profile-picture-upload">
          <label htmlFor="profile-pic">Profile Picture</label>
          <input
            type="file"
            id="profile-pic"
            accept=".svg, .png, .jpg, .gif"
            name="profilePicture"
            onChange={(e) => setProfileData({ ...profileData, profilePicture: e.target.files[0] })}
          />
          <p>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      <div className="profile-statistics">
        <h2>Profile Statistics</h2>
        <div className="statistics-container">
          <div className="stat-item">
            <p>User Engagement</p>
            <h3>75%</h3>
          </div>
          <div className="stat-item">
            <p>Total Views (last 7 days)</p>
            <h3>1.2k</h3>
          </div>
          <div className="stat-item">
            <p>Connections</p>
            <h3>150</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
