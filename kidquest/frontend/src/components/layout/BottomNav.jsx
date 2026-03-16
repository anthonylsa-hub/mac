import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Profiles', emoji: '👦' },
  { to: '/location', label: 'Play', emoji: '🎮' },
  { to: '/history', label: 'History', emoji: '📖' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 bg-white border-t border-purple-100 safe-bottom shadow-lg">
      <div className="flex items-stretch">
        {navItems.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold transition-colors
               ${isActive ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`
            }
          >
            <span className="text-2xl">{emoji}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
