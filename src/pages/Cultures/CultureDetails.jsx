// src/pages/Cultures/CultureDetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CultureDetails = () => {
  return (
    <div className="placeholder-page">
      <h1>Détails d'une Culture</h1>
      <p>Cette page est en développement. Elle affichera les détails complets d'une culture spécifique.</p>
      <Link to="/cultures">Retour à la liste des Cultures</Link>
    </div>
  );
};

export default CultureDetails;
