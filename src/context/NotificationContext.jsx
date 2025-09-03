import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'warning',
      titre: 'Stock faible',
      message: 'Le stock d\'engrais NPK est sous le seuil critique',
      date: new Date().toISOString(),
      lu: false
    },
    {
      id: 2,
      type: 'info',
      titre: 'Tâche programmée',
      message: 'Arrosage des tomates prévu demain matin',
      date: new Date().toISOString(),
      lu: false
    }
  ]);

  const addNotification = (notification) => {
    console.log('Nouvelle notification:', notification);
  };

  const markAsRead = (id) => {
    console.log('Notification marquée comme lue:', id);
  };

  const value = {
    notifications,
    addNotification,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
