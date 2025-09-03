// src/pages/Stocks/Stocks.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Stocks = () => {
  return (
    <div className="placeholder-page">
      <h1>Gestion des Stocks</h1>
      <p>Cette page est en développement. Elle permettra de gérer les stocks (ex. : engrais, semences).</p>
      <Link to="/dashboard">Retour au Dashboard</Link>
    </div>
  );
};

export default Stocks;
