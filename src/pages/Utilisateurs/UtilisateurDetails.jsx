// src/pages/Utilisateurs/UtilisateurDetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UtilisateurDetails = () => {
  return (
    <div className="placeholder-page">
      <h1>Détails d'un Utilisateur</h1>
      <p>Cette page est en développement. Elle affichera les détails complets d'un utilisateur spécifique.</p>
      <Link to="/utilisateurs">Retour à la liste des Utilisateurs</Link>
    </div>
  );
};

export default UtilisateurDetails;
