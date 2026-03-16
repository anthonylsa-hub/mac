import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';

const STAR_RATINGS = [
  { min: 0, max: 0, emoji: '🌱', msg: 'Keep trying!' },
  { min: 1, max: 1, emoji: '⭐', msg: 'Good start!' },
  { min: 2, max: 2, emoji: '⭐⭐', msg: 'Well done!' },
  { min: 3, max: 99, emoji: '⭐⭐⭐', msg: 'Perfect!' },
];

export function GameComplete({ game, score, onPlayAgain }) {
  const navigate = useNavigate();
  const rating = STAR_RATINGS.find(r => score >= r.min && score <= r.max) || STAR_RATINGS[0];

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center gap-6">
      <div className="text-8xl animate-celebrate">🏆</div>
      <div>
        <p className="text-5xl mb-2">{rating.emoji}</p>
        <h2 className="text-3xl font-extrabold text-gray-900">{rating.msg}</h2>
        <p className="text-xl font-bold text-brand-600 mt-1">
          {score} out of {game.totalRounds} correct!
        </p>
      </div>
      <div className="bg-brand-50 rounded-2xl p-4 border border-brand-200 max-w-sm">
        <p className="text-gray-700 font-medium italic">"{game.completionMessage}"</p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button size="lg" onClick={onPlayAgain} className="w-full">🔄 Play Again</Button>
        <Button size="lg" variant="secondary" onClick={() => navigate('/location')} className="w-full">📍 New Location</Button>
        <Button size="md" variant="ghost" onClick={() => navigate('/')} className="w-full">👦 Change Child</Button>
      </div>
    </div>
  );
}
