import React from 'react';
import logopng from '/Main/logo.png';
import './InitialPage.css';

export default function InitialPage() {
  const handleJoinClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="InitialPage-container">
      <div className="card-main">
        <div className="titulo">
          <h1>Dragones & Mazmorras</h1>
          <h3>Un paso más allá en tu partida</h3>
        </div>
        <div className='txt-content'>
          <h4 className="txt">
            Recopila historias de tus aventuras, gestiona tus personajes y las criaturas del camino.
            <br /><br />
            Accede al contenido de rol rápidamente, calcula tu daño en combate y más importante...
            <br />
            ¡Los hechizos que te quedan!
          </h4>
        </div>
        <div className='logo-img'>
          <img src={logopng} alt="DnD Logo" />
        </div>
        <div>
          <button
            className="botonInicio"
            onClick={handleJoinClick}
          >
            <strong>¡Únete a la aventura!</strong>
          </button>
          <p className="version"><small>3.5e</small></p>
        </div>
      </div>
    </div>
  );
}
