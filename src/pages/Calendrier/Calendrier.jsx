// src/pages/Calendrier/Calendrier.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Calendrier = () => {
  return (
    <div className="placeholder-page">
      <h1>Calendrier</h1>
      <p>Cette page est en développement. Elle affichera un calendrier global des tâches et événements agricoles.</p>
      <Link to="/dashboard">Retour au Dashboard</Link>
    </div>
  );
};

export default Calendrier;
