import React from 'react';

export function Badge({ children, color = 'purple', className = '' }) {
  const colors = {
    purple: 'bg-brand-100 text-brand-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    pink: 'bg-pink-100 text-pink-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
