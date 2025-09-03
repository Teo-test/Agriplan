import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import '../../assets/styles/main.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <h1>🌱 AgroPlanner</h1>
          </div>
        </div>

        <div className="header-right">
          {/* Notifications */}
          <div className="header-item notification-container">
            <button 
              className="notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="notification-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(notification => (
                      <div key={notification.id} className="notification-item">
                        <div className={`notification-type ${notification.type}`}>
                          {notification.type === 'warning' && '⚠️'}
                          {notification.type === 'info' && 'ℹ️'}
                          {notification.type === 'success' && '✅'}
                        </div>
                        <div className="notification-content">
                          <h4>{notification.titre}</h4>
                          <p>{notification.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">Aucune notification</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Menu utilisateur */}
          <div className="header-item user-container">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span>{user?.nom?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className="user-name">{user?.nom || 'Utilisateur'}</span>
              <span className="dropdown-icon">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h3>{user?.nom}</h3>
                  <p>{user?.email}</p>
                  <span className="user-role">{user?.role}</span>
                </div>
                <div className="user-menu-divider"></div>
                <div className="user-menu-items">
                  <button className="user-menu-item">
                    👤 Mon Profil
                  </button>
                  <button className="user-menu-item">
                    ⚙️ Paramètres
                  </button>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-item" onClick={logout}>
                    🚪 Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
