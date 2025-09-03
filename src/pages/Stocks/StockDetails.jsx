// src/pages/Stocks/StockDetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StockDetails = () => {
  return (
    <div className="placeholder-page">
      <h1>Détails d'un Stock</h1>
      <p>Cette page est en développement. Elle affichera les détails complets d'un item de stock.</p>
      <Link to="/stocks">Retour à la liste des Stocks</Link>
    </div>
  );
};

export default StockDetails;
