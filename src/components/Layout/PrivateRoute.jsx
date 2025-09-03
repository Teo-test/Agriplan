import React from 'react';

const PrivateRoute = ({ children }) => {
  // Pas de vérification - renvoie toujours les enfants pour les tests
  return children;
};

export default PrivateRoute;
