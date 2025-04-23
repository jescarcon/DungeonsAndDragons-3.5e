import React from 'react';
import './DiceGroup.css';
import NormalDiceRoller from './NormalRoller/NormalRoller';
import CustomRoller from './CustomRoller/CustomRoller';

export default function DiceGroup() {
  return (
    <div className="DiceGroup-container">
      <h1 className="dicegroup-title">Lanzador de Dados</h1>
      <div className="dicegroup-rollers">
        <div className="normal-dice-roller">
          <NormalDiceRoller />
        </div>
        <div className="custom-dice-roller">
          <CustomRoller />
        </div>
      </div>
    </div>
  );
}
