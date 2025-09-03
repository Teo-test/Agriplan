// src/pages/Utilisateurs/Utilisateurs.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Utilisateurs = () => {
  return (
    <div className="placeholder-page">
      <h1>Gestion des Utilisateurs</h1>
      <p>Cette page est en développement. Elle permettra de gérer les utilisateurs (ex. : fermiers, ouvriers).</p>
      <Link to="/dashboard">Retour au Dashboard</Link>
    </div>
  );
};

export default Utilisateurs;
