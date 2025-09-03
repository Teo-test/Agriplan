// Hook simple pour les permissions (version de test)
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission) => {
    // Pour les tests, on autorise tout
    return true;
  };

  const canAccess = (resource) => {
    // Pour les tests, on autorise tout
    return true;
  };

  return {
    hasPermission,
    canAccess,
    userRole: user?.role || 'farmer'
  };
};
