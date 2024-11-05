import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Asegúrate de importar el archivo CSS
import logo from '/Main/logo.png'; // Asegúrate de colocar la ruta correcta a tu imagen

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
          Dragones y Mazmorras 3.5e
        </Link>
      </div>
      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <a href="/games" className="navbar-item">Mis Partidas</a>
        <a href="/combat" className="navbar-item">Combate</a>
        <a href="#" className="navbar-item">Libreria</a>
        <a href="#" className="navbar-item">Perfil</a>
        <a href="/logout" className="navbar-item">Cerrar Sesión</a>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </div>
    </nav>
  );
};

export default Navbar;
