import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { useProfiles } from '../hooks/useProfiles.js';
import { GameLoader } from '../components/game/GameLoader.jsx';
import { GameRenderer } from '../components/game/GameRenderer.jsx';
import { Button } from '../components/ui/Button.jsx';
import { generateGame } from '../api/gamesApi.js';
import { v4 as uuidv4 } from 'uuid';

export function GamePage() {
  const navigate = useNavigate();
  const { session, setGame, setError, completeSession, clearSession } = useGame();
  const { selectedProfile } = useProfiles();

  useEffect(() => {
    if (!session) navigate('/location');
  }, [session, navigate]);

  if (!session) return null;

  if (session.status === 'generating') {
    return <GameLoader />;
  }

  if (session.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6 text-center">
        <div className="text-6xl">😔</div>
        <h2 className="text-2xl font-bold text-gray-800">Couldn't generate a game</h2>
        <p className="text-gray-500">{session.errorMessage}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={async () => {
            setGame(null);
            // Retry
            try {
              const result = await generateGame({
                profile: { age: session.profileSnapshot.age, skillTracks: session.profileSnapshot.skillTracks },
                location: session.location,
                sessionId: uuidv4(),
              });
              setGame(result.game);
            } catch (err) {
              setError(err.message);
            }
          }}>🔄 Try Again</Button>
          <Button variant="secondary" onClick={() => { clearSession(); navigate('/location'); }}>← Change Location</Button>
        </div>
      </div>
    );
  }

  if (session.status === 'active' && session.game) {
    return (
      <GameRenderer
        game={session.game}
        location={session.location}
        onRestart={async () => {
          // Re-generate a fresh game
          try {
            const result = await generateGame({
              profile: { age: session.profileSnapshot.age, skillTracks: session.profileSnapshot.skillTracks },
              location: session.location,
              sessionId: uuidv4(),
            });
            setGame(result.game);
          } catch (err) {
            setError(err.message);
          }
        }}
      />
    );
  }

  return <GameLoader />;
}
