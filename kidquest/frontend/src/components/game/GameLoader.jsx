import React, { useState, useEffect } from 'react';
import { Spinner } from '../ui/Spinner.jsx';

const MESSAGES = [
  'Cooking up your adventure... 🍳',
  'Sprinkling in some magic... ✨',
  'Packing the fun bag... 🎒',
  'Teaching the AI to play... 🤖',
  'Almost ready for liftoff... 🚀',
  'Mixing learning with fun... 🎨',
];

export function GameLoader() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setMsgIdx((i) => (i + 1) % MESSAGES.length), 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <div className="text-7xl animate-bounce">🎯</div>
      <Spinner size="lg" />
      <p className="text-xl font-bold text-brand-700 text-center animate-pulse-soft">{MESSAGES[msgIdx]}</p>
      <p className="text-gray-400 text-sm text-center">Creating a personalized game just for your child</p>
    </div>
  );
}
