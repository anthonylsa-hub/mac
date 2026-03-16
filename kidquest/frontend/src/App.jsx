import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext.jsx';
import { GameProvider } from './context/GameContext.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LocationPage } from './pages/LocationPage.jsx';
import { GamePage } from './pages/GamePage.jsx';
import { HistoryPage } from './pages/HistoryPage.jsx';

export default function App() {
  return (
    <ProfileProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </ProfileProvider>
  );
}
