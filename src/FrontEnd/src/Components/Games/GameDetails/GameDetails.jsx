import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './GameDetails.css';
import Diario from '/Character/Diario.jpg';
import NotasDeViaje from '/Character/NotasDeViaje.jpg';
import Taberna from '/Character/Taberna.jpg';

export default function GameDetails() {
  // Obtén el pk de la URL usando useParams
  const { pk } = useParams();

  return (
    <div className='GameDetails-Container'>
      <div className='GameDetails-Title'>
        <h1>Detalles de la Partida</h1>
      </div>
      <div className='GameDetails-Options'>
        <Link to={`/games/${pk}/diary`} className='GameDetails-Link'>
          <div className='GameDetails-Card'>
            <img src={Diario} alt="Diario" className='GameDetails-Image' />
            <div className='GameDetails-Text'>Diario</div>
          </div>
        </Link>
        
        <Link to={`/games/${pk}/tavern`} className='GameDetails-Link'>
          <div className='GameDetails-Card'>
            <img src={Taberna} alt="Taberna" className='GameDetails-Image' />
            <div className='GameDetails-Text'>Taberna</div>
          </div>
        </Link>

        <Link to={`/games/${pk}/notes`} className='GameDetails-Link'>
          <div className='GameDetails-Card'>
            <img src={NotasDeViaje} alt="Notas de Viaje" className='GameDetails-Image' />
            <div className='GameDetails-Text'>Notas de Viaje</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
