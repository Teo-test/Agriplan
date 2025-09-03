// src/pages/Taches/ModifierTache.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ModifierTache = () => {
  return (
    <div className="placeholder-page">
      <h1>Modifier une Tâche</h1>
      <p>Cette page est en développement. Elle permettra de modifier les détails d'une tâche existante.</p>
      <Link to="/taches">Retour à la liste des Tâches</Link>
    </div>
  );
};

export default ModifierTache;
