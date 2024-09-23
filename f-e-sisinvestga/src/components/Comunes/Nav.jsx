import React from "react";
import { Link } from 'react-router-dom';
import '../../css/componentes/Comunes/Nav.css';

function Nav() {
    return (
        <nav className="nav-bar">
            <div className="logo">UCSD</div>
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/registro" className="nav-link">Registro de Investigadores</Link>
                </li>
                <li className="nav-item">
                    <Link to="/proyectos" className="nav-link">Proyectos</Link>
                </li>
                <li className="nav-item">
                    <Link to="/publicaciones" className="nav-link">Publicaciones</Link>
                </li>
                <li className="nav-item">
                    <Link to="/perfil" className="nav-link">Perfil</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
