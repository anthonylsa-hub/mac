import React from 'react';
import { BottomNav } from './BottomNav.jsx';

export function AppShell({ children, title, showNav = true, action }) {
  return (
    <div className="min-h-screen flex flex-col bg-purple-50 max-w-lg mx-auto">
      {title && (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 px-5 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-extrabold text-brand-700 flex items-center gap-2">
            <span>🎯</span> {title}
          </h1>
          {action}
        </header>
      )}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
