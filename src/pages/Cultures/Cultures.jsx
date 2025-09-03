// src/pages/Cultures/Cultures.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Cultures = () => {
  return (
    <div className="placeholder-page">
      <h1>Gestion des Cultures</h1>
      <p>Cette page est en développement. Elle permettra de lister et gérer les cultures (ex. : tomates, salades) liées aux parcelles.</p>
      <Link to="/dashboard">Retour au Dashboard</Link>
    </div>
  );
};

export default Cultures;
