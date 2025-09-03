import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Utilisateur fictif pour les tests
  const [user] = useState({
    id: 1,
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'farmer',
    exploitation: 'Ferme des Collines',
    avatar: null
  });

  const [isAuthenticated] = useState(true); // Toujours connecté pour les tests

  const login = async () => {
    // Simulation de connexion réussie
    return { success: true };
  };

  const logout = () => {
    // Simulation de déconnexion
    console.log('Déconnexion simulée');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
