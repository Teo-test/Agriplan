// src/pages/Calendrier/CalendrierJour.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CalendrierJour = () => {
  return (
    <div className="placeholder-page">
      <h1>Calendrier d'un Jour</h1>
      <p>Cette page est en développement. Elle affichera les détails d'une journée spécifique du calendrier.</p>
      <Link to="/calendrier">Retour au Calendrier</Link>
    </div>
  );
};

export default CalendrierJour;
