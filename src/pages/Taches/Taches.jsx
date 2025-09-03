// src/pages/Taches/Taches.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Taches = () => {
  return (
    <div className="placeholder-page">
      <h1>Gestion des Tâches</h1>
      <p>Cette page est en développement. Elle permettra de lister et assigner des tâches (ex. : arrosage, récolte).</p>
      <Link to="/dashboard">Retour au Dashboard</Link>
    </div>
  );
};

export default Taches;
