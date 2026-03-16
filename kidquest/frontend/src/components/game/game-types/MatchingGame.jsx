import React, { useState, useMemo } from 'react';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function MatchingGame({ round, phase, onAnswer }) {
  const leftItems = useMemo(() => round.pairs?.map(p => ({ id: p.leftId, label: p.leftLabel, emoji: p.leftEmoji, pairId: p.leftId })) || [], [round]);
  const rightItems = useMemo(() => shuffle(round.pairs?.map(p => ({ id: p.rightId, label: p.rightLabel, emoji: p.rightEmoji, pairId: p.leftId })) || []), [round]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState({}); // leftId -> rightId
  const [wrongPair, setWrongPair] = useState(null);

  const handleLeft = (item) => {
    if (matched[item.id]) return;
    setSelectedLeft(item.id === selectedLeft ? null : item.id);
  };

  const handleRight = (item) => {
    if (!selectedLeft) return;
    const leftPair = leftItems.find(l => l.id === selectedLeft);
    if (leftPair && leftPair.pairId === item.pairId) {
      // Correct match
      const newMatched = { ...matched, [selectedLeft]: item.id };
      setMatched(newMatched);
      setSelectedLeft(null);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      if (Object.keys(newMatched).length === leftItems.length) {
        onAnswer(true);
      }
    } else {
      // Wrong match
      setWrongPair({ left: selectedLeft, right: item.id });
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => { setWrongPair(null); setSelectedLeft(null); }, 600);
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <p className="text-xl font-bold text-gray-800 text-center">{round.prompt}</p>
      <div className="flex gap-3">
        {/* Left column */}
        <div className="flex-1 space-y-2">
          {leftItems.map((item) => {
            const isMatched = !!matched[item.id];
            const isSelected = selectedLeft === item.id;
            const isWrong = wrongPair?.left === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLeft(item)}
                disabled={isMatched}
                className={`w-full flex items-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all touch-manipulation
                  ${isMatched ? 'border-green-400 bg-green-50 text-green-700 opacity-70' : ''}
                  ${isSelected && !isMatched ? 'border-brand-500 bg-brand-50 scale-[1.03] shadow text-brand-800' : ''}
                  ${isWrong ? 'border-red-400 bg-red-50 animate-shake' : ''}
                  ${!isMatched && !isSelected && !isWrong ? 'border-gray-200 bg-white text-gray-700' : ''}
                `}
              >
                {item.emoji && <span className="text-xl">{item.emoji}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Arrow */}
        <div className="flex flex-col justify-around text-gray-300 font-bold text-xl pt-1">
          {leftItems.map((_, i) => <span key={i}>→</span>)}
        </div>

        {/* Right column */}
        <div className="flex-1 space-y-2">
          {rightItems.map((item) => {
            const isMatched = Object.values(matched).includes(item.id);
            const isWrong = wrongPair?.right === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleRight(item)}
                disabled={isMatched || !selectedLeft}
                className={`w-full flex items-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all touch-manipulation
                  ${isMatched ? 'border-green-400 bg-green-50 text-green-700 opacity-70' : ''}
                  ${isWrong ? 'border-red-400 bg-red-50 animate-shake' : ''}
                  ${!isMatched && !isWrong && selectedLeft ? 'border-brand-200 bg-white text-gray-700 hover:border-brand-400 hover:bg-brand-50' : ''}
                  ${!isMatched && !isWrong && !selectedLeft ? 'border-gray-200 bg-white text-gray-400' : ''}
                `}
              >
                {item.emoji && <span className="text-xl">{item.emoji}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-sm text-gray-400">
        {Object.keys(matched).length}/{leftItems.length} matched
      </p>
    </div>
  );
}
