import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: '📊',
      path: '/dashboard',
      exact: true
    },
    {
      title: 'Parcelles',
      icon: '🌾',
      path: '/parcelles'
    },
    {
      title: 'Cultures',
      icon: '🌱',
      path: '/cultures'
    },
    {
      title: 'Calendrier',
      icon: '📅',
      path: '/calendrier'
    },
    {
      title: 'Tâches',
      icon: '✓',
      path: '/taches'
    },
    {
      title: 'Stocks',
      icon: '📦',
      path: '/stocks'
    },
    {
      title: 'Utilisateurs',
      icon: '👥',
      path: '/utilisateurs'
    },
    {
      title: 'Rapports',
      icon: '📈',
      path: '/rapports'
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="sidebar-text">{item.title}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
