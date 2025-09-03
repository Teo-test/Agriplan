// src/pages/Rapports/RapportDetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RapportDetails = () => {
  return (
    <div className="placeholder-page">
      <h1>Détails d'un Rapport</h1>
      <p>Cette page est en développement. Elle affichera les détails complets d'un rapport spécifique.</p>
      <Link to="/rapports">Retour à la liste des Rapports</Link>
    </div>
  );
};

export default RapportDetails;
