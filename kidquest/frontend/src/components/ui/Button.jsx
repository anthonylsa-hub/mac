import React from 'react';

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-md',
  secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 border border-gray-300 shadow-sm',
  success: 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-md',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-md',
  ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-600',
};

const sizes = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-5 py-3 text-base min-h-[48px]',
  lg: 'px-6 py-4 text-lg min-h-[56px]',
  xl: 'px-8 py-5 text-xl min-h-[64px]',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-2xl
        transition-all duration-150 select-none touch-manipulation
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
