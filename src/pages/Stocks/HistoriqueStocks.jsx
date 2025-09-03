// src/pages/Stocks/HistoriqueStocks.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HistoriqueStocks = () => {
  return (
    <div className="placeholder-page">
      <h1>Historique des Stocks</h1>
      <p>Cette page est en développement. Elle affichera l'historique des mouvements de stocks.</p>
      <Link to="/stocks">Retour à la liste des Stocks</Link>
    </div>
  );
};

export default HistoriqueStocks;
