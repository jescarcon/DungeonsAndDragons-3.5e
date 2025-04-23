import React, { useState } from 'react';
import './CustomRoller.css';

export default function CustomRoller() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState(null);

  const rollDice = (n, m) => {
    const rolls = [];
    for (let i = 0; i < n; i++) {
      rolls.push(Math.floor(Math.random() * m) + 1);
    }
    return rolls;
  };

  const parseExpression = (expr) => {
    const diceRegex = /([+-]?)(\d*)d(\d+)/gi;
    const numberRegex = /([+-]?\d+)(?!d)/g;

    const diceResults = {};
    let diceTotal = 0;
    let match;

    while ((match = diceRegex.exec(expr)) !== null) {
      const sign = match[1] === '-' ? -1 : 1;
      const num = parseInt(match[2] || '1', 10);
      const faces = parseInt(match[3], 10);
      const rolls = rollDice(num, faces).map(r => r * sign);
      const key = `d${faces}`;
      if (!diceResults[key]) diceResults[key] = [];
      diceResults[key].push(...rolls);
      diceTotal += rolls.reduce((a, b) => a + b, 0);
    }

    const exprWithoutDice = expr.replace(diceRegex, '');
    const extras = [...exprWithoutDice.matchAll(numberRegex)].map(m => parseInt(m[1], 10));
    const extraTotal = extras.reduce((a, b) => a + b, 0);
    const total = diceTotal + extraTotal;

    return {
      diceResults,
      diceTotal,
      extras,
      extraTotal,
      total
    };
  };

  const handleRoll = () => {
    const evalData = parseExpression(expression);
    setDetails(evalData);
    setResult(evalData.total);
  };

  const handleClear = () => {
    setExpression('');
    setResult(null);
    setDetails(null);
  };

  return (
    <div className="custom-roller">
      <h2>¡Crea tu propia tirada!</h2>
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Ej: 2d4+1d6+1d4-1+5"
      />
      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={handleRoll}>Lanzar</button>
        <button onClick={handleClear} style={{ marginLeft: '0.5rem' }}>Limpiar</button>
      </div>

      {details && (
        <div className="results">
          {Object.entries(details.diceResults).map(([key, rolls]) => (
            <div key={key}>
              {key}: {rolls.map(v => v).join(', ')}
            </div>
          ))}
          {details.extras.length > 0 && (
            <div>
              Extra: {details.extras.join(', ')} = {details.extraTotal}
            </div>
          )}
          <div>Suma Total de Dados: {details.diceTotal}</div>
          <div>Total Extra: {details.extraTotal}</div>
          <div><strong>Total: {details.total}</strong></div>
        </div>
      )}
    </div>
  );
}
