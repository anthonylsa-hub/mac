import React, { createContext, useState, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const GameContext = createContext(null);

const HISTORY_KEY = 'kidquest_history';

function addToHistory(session) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.unshift(session);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {}
}

export function GameProvider({ children }) {
  const [session, setSession] = useState(null);

  const startSession = useCallback(({ profile, location }) => {
    setSession({
      id: uuidv4(),
      profileId: profile.id,
      profileSnapshot: { name: profile.name, age: profile.age, skillTracks: profile.skillTracks },
      location,
      game: null,
      status: 'generating',
      startedAt: new Date().toISOString(),
    });
  }, []);

  const setGame = useCallback((game) => {
    setSession((prev) => prev ? { ...prev, game, status: 'active' } : prev);
  }, []);

  const completeSession = useCallback((score) => {
    setSession((prev) => {
      if (!prev) return prev;
      const completed = { ...prev, status: 'complete', score, completedAt: new Date().toISOString() };
      addToHistory(completed);
      return completed;
    });
  }, []);

  const setError = useCallback((message) => {
    setSession((prev) => prev ? { ...prev, status: 'error', errorMessage: message } : prev);
  }, []);

  const clearSession = useCallback(() => setSession(null), []);

  return (
    <GameContext.Provider value={{ session, startSession, setGame, completeSession, setError, clearSession }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
