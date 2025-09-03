// src/pages/Taches/TacheDetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TacheDetails = () => {
  return (
    <div className="placeholder-page">
      <h1>Détails d'une Tâche</h1>
      <p>Cette page est en développement. Elle affichera les détails complets d'une tâche spécifique.</p>
      <Link to="/taches">Retour à la liste des Tâches</Link>
    </div>
  );
};

export default TacheDetails;
