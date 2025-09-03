import React from 'react';

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose, 
  className = '',
  ...props 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'danger': return '❌';
      case 'info': 
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`alert alert-${type} ${className}`} {...props}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <div className="alert-message">
          {title && <h4 className="alert-title">{title}</h4>}
          <div className="alert-body">
            {children}
          </div>
        </div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
