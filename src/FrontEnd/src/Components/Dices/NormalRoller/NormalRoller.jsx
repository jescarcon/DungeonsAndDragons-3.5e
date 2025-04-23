import React, { useState } from 'react';
import './NormalRoller.css'; 

function NormalDiceRoller() {
  const [rolls, setRolls] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  const rollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1;
    let updatedRolls = [...rolls];
    let found = false;

    updatedRolls.forEach(roll => {
      if (roll.sides === sides) {
        found = true;
        roll.results.push(result);
      }
    });

    if (!found) {
      updatedRolls.push({ sides, results: [result] });
    }

    const newTotalSum = totalSum + result;
    setRolls(updatedRolls);
    setTotalSum(newTotalSum);
  };

  const clearRolls = () => {
    setRolls([]);
    setTotalSum(0);
  };

  return (
      <div className="dice-roller">
        <h2 id="titulo">¡Tíralos tú mismo!</h2>
        <div className="buttons">
          <button onClick={() => rollDice(2)}>1d2</button>
          <button onClick={() => rollDice(4)}>1d4</button>
          <button onClick={() => rollDice(6)}>1d6</button>
          <button onClick={() => rollDice(8)}>1d8</button>
          <button onClick={() => rollDice(10)}>1d10</button>
          <button onClick={() => rollDice(12)}>1d12</button>
          <button onClick={() => rollDice(20)}>1d20</button>
          <button onClick={() => rollDice(100)}>1d100</button>
          <button onClick={clearRolls} className="reset">Limpiar</button>
        </div>
        {rolls.length > 0 && (
          <div className="results">
            <h3>Resultados de los lanzamientos:</h3>
            <ul>
              {rolls.map((roll, index) => (
                <li key={index}>{`d${roll.sides}: ${roll.results.join(', ')}`}</li>
              ))}
            </ul>
            <p>Suma total: {totalSum}</p>
          </div>
        )}
        
      </div>
          
  );
}

export default NormalDiceRoller;
