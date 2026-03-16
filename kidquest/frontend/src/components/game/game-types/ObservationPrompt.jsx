import React, { useState, useEffect } from 'react';

export function ObservationPrompt({ round, phase, onAnswer }) {
  const [checked, setChecked] = useState(new Set());
  const total = round.checklist?.length || 0;

  const toggle = (id) => {
    if (navigator.vibrate) navigator.vibrate(30);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (checked.size === total && total > 0) {
      setTimeout(() => onAnswer(true), 700);
    }
  }, [checked, total, onAnswer]);

  const progress = total > 0 ? Math.round((checked.size / total) * 100) : 0;

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <p className="text-xl font-bold text-gray-800 text-center leading-snug">{round.prompt}</p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-center text-sm text-gray-500">{checked.size} of {total} found</p>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {round.checklist?.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left font-semibold
                transition-all touch-manipulation
                ${isChecked
                  ? 'border-green-400 bg-green-50 text-green-800 animate-bounce-in'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]'
                }
              `}
            >
              <span className={`text-3xl transition-transform ${isChecked ? 'scale-125' : ''}`}>
                {isChecked ? '✅' : (item.emoji || '⬜')}
              </span>
              <span className={isChecked ? 'line-through text-green-600' : ''}>{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
