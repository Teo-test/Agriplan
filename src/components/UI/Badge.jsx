import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={`badge badge-${variant} badge-${size} ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
