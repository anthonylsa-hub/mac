import React, { useState } from 'react';
import { Button } from '../../ui/Button.jsx';

export function MultipleChoice({ round, phase, onAnswer }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (option) => {
    if (selectedId) return;
    setSelectedId(option.id);
    if (navigator.vibrate) navigator.vibrate(option.isCorrect ? [50, 30, 50] : [200]);
    onAnswer(option.isCorrect);
  };

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <p className="text-xl font-bold text-gray-800 text-center leading-snug">{round.prompt}</p>
      <div className="grid grid-cols-1 gap-3">
        {round.options?.map((opt) => {
          const isSelected = selectedId === opt.id;
          const showResult = phase === 'reviewing' && isSelected;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={!!selectedId}
              className={`
                flex items-center gap-4 p-4 rounded-2xl border-2 text-left font-semibold text-lg transition-all
                min-h-[64px] touch-manipulation
                ${!selectedId ? 'border-gray-200 bg-white hover:border-brand-400 hover:bg-brand-50 active:scale-[0.98]' : ''}
                ${showResult && opt.isCorrect ? 'border-green-400 bg-green-50 text-green-800 animate-bounce-in' : ''}
                ${showResult && !opt.isCorrect ? 'border-red-400 bg-red-50 text-red-800 animate-shake' : ''}
                ${phase === 'reviewing' && !isSelected && opt.isCorrect ? 'border-green-300 bg-green-50 text-green-700 opacity-70' : ''}
                ${phase === 'reviewing' && !isSelected && !opt.isCorrect ? 'opacity-30' : ''}
              `}
            >
              {opt.emoji && <span className="text-3xl shrink-0">{opt.emoji}</span>}
              <span>{opt.text}</span>
              {phase === 'reviewing' && opt.isCorrect && <span className="ml-auto text-2xl">✅</span>}
              {showResult && !opt.isCorrect && <span className="ml-auto text-2xl">❌</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
