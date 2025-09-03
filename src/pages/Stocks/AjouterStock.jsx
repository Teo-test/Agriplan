// src/pages/Stocks/AjouterStock.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AjouterStock = () => {
  return (
    <div className="placeholder-page">
      <h1>Ajouter un Stock</h1>
      <p>Cette page est en développement. Elle permettra d'ajouter un nouvel item de stock.</p>
      <Link to="/stocks">Retour à la liste des Stocks</Link>
    </div>
  );
};

export default AjouterStock;
