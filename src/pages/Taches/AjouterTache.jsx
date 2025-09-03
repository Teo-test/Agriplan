// src/pages/Taches/AjouterTache.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AjouterTache = () => {
  return (
    <div className="placeholder-page">
      <h1>Ajouter une Tâche</h1>
      <p>Cette page est en développement. Elle permettra d'ajouter une nouvelle tâche.</p>
      <Link to="/taches">Retour à la liste des Tâches</Link>
    </div>
  );
};

export default AjouterTache;
