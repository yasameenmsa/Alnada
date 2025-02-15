import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'default';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className
}) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-sm font-medium',
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;