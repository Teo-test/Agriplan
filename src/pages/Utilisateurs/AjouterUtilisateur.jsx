// src/pages/Utilisateurs/AjouterUtilisateur.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AjouterUtilisateur = () => {
  return (
    <div className="placeholder-page">
      <h1>Ajouter un Utilisateur</h1>
      <p>Cette page est en développement. Elle permettra d'ajouter un nouvel utilisateur.</p>
      <Link to="/utilisateurs">Retour à la liste des Utilisateurs</Link>
    </div>
  );
};

export default AjouterUtilisateur;
