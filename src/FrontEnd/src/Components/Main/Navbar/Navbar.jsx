import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '/Main/logo.png';
import userDefault from '/Common/user-default.png';
import navbarIcon from '/Common/navbar-icon.png';

import { useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.navbar-user')) setIsMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Parte superior */}
      <div className="navbar-top">
        <div className="navbar-title text-0">
          Dragones y Mazmorras 3.5e
        </div>

        <div className="navbar-logo">
          <Link to="/home"><img src={logo} alt="Logo" /></Link>
        </div>

        <div className="navbar-user">
          <img
            src={userDefault}
            alt="Usuario"
            className="user-icon"
            onClick={toggleUserMenu}
          />
          {isMenuOpen && (
            <div className="user-menu" onMouseLeave={closeMenu}>
              <Link to="/profile">Perfil</Link>
              <Link to="/logout">Cerrar Sesión</Link>
            </div>
          )}
        </div>

      </div>

      {/* Parte inferior */}
      <div className="navbar-bottom">
        <div className="navbar-links text-1">
          <div className="navbar-icon"><img src={navbarIcon} /></div>
          <div className="navbar-link"><Link to="/games">Mis Partidas</Link></div>
          <div className="navbar-link"><Link to="#">Combate</Link></div>
          <div className="navbar-link"><Link to="/dice-roller">Dados</Link></div>
          <div className="navbar-link"><Link to="#">Librería</Link></div>
          <div className="navbar-link"><Link to="#">Soporte</Link></div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
