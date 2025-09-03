// src/pages/Rapports/Rapports.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Rapports = () => {
  return (
    <div className="placeholder-page">
      <h1>Gestion des Rapports</h1>
      <p>Cette page est en développement. Elle permettra de générer et visualiser des rapports (ex. : rendement, stocks).</p>
      <Link to="/dashboard">Retour au Dashboard</Link>
    </div>
  );
};

export default Rapports;
