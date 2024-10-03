import React from "react";
import "../../css/componentes/Home/footerHome.css";

const Footer = () => {
    return (
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>Universidad Católica Santo Domingo</h3>
            <p>
              La Universidad Católica Santo Domingo es una institución educativa comprometida con la
              excelencia académica y el desarrollo de la investigación en el país.
            </p>
          </div>
          <div className="footer-section contact">
            <h3>Contacto</h3>
            <p><i className="bi bi-geo-alt"></i> Dirección: Av. Bolívar 800, Santo Domingo</p>
            <p><i className="bi bi-telephone"></i> Teléfono: (809)-544-2812</p>
            <p><i className="bi bi-envelope"></i> Email: info@ucsd.edu.do</p>
          </div>
        </div>
        <div className="footer-map">
          <iframe
            title="Mapa de ubicación"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.2569527522543!2d-69.9303798!3d18.4700682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf7a15c171fdc5%3A0x3cdd57d6c6da8a1!2sUniversidad%20Cat%C3%B3lica%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1693091197088!5m2!1ses!2sdo"
            width="30%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Universidad Católica Santo Domingo. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
};

export default Footer;