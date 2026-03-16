import React, { useState } from 'react';
import { Button } from '../../ui/Button.jsx';

export function TapToSelect({ round, phase, onAnswer }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (navigator.vibrate) navigator.vibrate(30);
      return next;
    });
  };

  const handleSubmit = () => {
    const targets = round.items.filter(i => i.isTarget).map(i => i.id);
    const selectedArr = [...selected];
    const correct = targets.every(t => selected.has(t)) && selectedArr.every(s => targets.includes(s));
    setSubmitted(true);
    onAnswer(correct);
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <p className="text-xl font-bold text-gray-800 text-center leading-snug">{round.prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        {round.items?.map((item) => {
          const isSelected = selected.has(item.id);
          const showCorrect = submitted && item.isTarget;
          const showWrong = submitted && isSelected && !item.isTarget;
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`
                flex flex-col items-center gap-2 p-5 rounded-2xl border-2 font-semibold text-base transition-all
                min-h-[100px] touch-manipulation
                ${isSelected && !submitted ? 'border-brand-500 bg-brand-50 scale-[1.04] shadow-md text-brand-800' : ''}
                ${!isSelected && !submitted ? 'border-gray-200 bg-white text-gray-700 hover:border-brand-300' : ''}
                ${showCorrect ? 'border-green-400 bg-green-50 text-green-800 animate-bounce-in' : ''}
                ${showWrong ? 'border-red-400 bg-red-50 text-red-700 animate-shake' : ''}
                ${submitted && !showCorrect && !showWrong ? 'opacity-40' : ''}
              `}
            >
              <span className="text-4xl">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      {!submitted && (
        <Button className="w-full" size="lg" onClick={handleSubmit} disabled={selected.size === 0}>
          ✅ Check My Answer
        </Button>
      )}
    </div>
  );
}
