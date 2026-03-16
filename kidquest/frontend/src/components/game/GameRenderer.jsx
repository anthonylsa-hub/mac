import React, { useState, useCallback } from 'react';
import { MultipleChoice } from './game-types/MultipleChoice.jsx';
import { TapToSelect } from './game-types/TapToSelect.jsx';
import { MatchingGame } from './game-types/MatchingGame.jsx';
import { ObservationPrompt } from './game-types/ObservationPrompt.jsx';
import { DragAndDrop } from './game-types/DragAndDrop.jsx';
import { GameComplete } from './GameComplete.jsx';
import { GameHeader } from './GameHeader.jsx';
import { Button } from '../ui/Button.jsx';

const GAME_TYPE_MAP = {
  multiple_choice: MultipleChoice,
  tap_to_select: TapToSelect,
  matching: MatchingGame,
  observation: ObservationPrompt,
  drag_and_drop: DragAndDrop,
};

export function GameRenderer({ game, location, onRestart }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('playing'); // playing | reviewing | complete
  const [hintVisible, setHintVisible] = useState(false);

  const round = game.rounds[currentRound];
  const GameTypeComponent = GAME_TYPE_MAP[game.type];

  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) {
      setScore((s) => s + 1);
      if (navigator.vibrate) navigator.vibrate([50, 30, 100]);
    }
    // For matching and observation, the game type signals completion internally; for others show review
    if (game.type === 'matching' || game.type === 'observation' || game.type === 'drag_and_drop') {
      setTimeout(() => advance(isCorrect ? score + 1 : score), 1200);
    } else {
      setPhase('reviewing');
    }
  }, [score, game.type]);

  const advance = useCallback((currentScore) => {
    if (currentRound + 1 >= game.totalRounds) {
      setPhase('complete');
    } else {
      setCurrentRound((r) => r + 1);
      setPhase('playing');
      setHintVisible(false);
    }
  }, [currentRound, game.totalRounds]);

  const handleNext = () => advance(score);

  if (phase === 'complete') {
    return <GameComplete game={game} score={score} onPlayAgain={onRestart} />;
  }

  if (!GameTypeComponent) {
    return <div className="p-5 text-red-600">Unknown game type: {game.type}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <GameHeader game={game} location={location} currentRound={currentRound + 1} score={score} />

      {/* Instructions (first round only) */}
      {currentRound === 0 && (
        <div className="mx-5 mt-4 bg-purple-50 rounded-2xl p-4 border border-purple-200 text-sm text-purple-800 font-medium">
          📋 {game.instructions}
        </div>
      )}

      <div className="flex-1">
        <GameTypeComponent key={`${currentRound}-${game.id}`} round={round} phase={phase} onAnswer={handleAnswer} />
      </div>

      {/* Review panel */}
      {phase === 'reviewing' && (
        <div className="p-5 bg-white border-t border-gray-100 space-y-3 animate-fade-in">
          <p className="font-semibold text-gray-800">💡 {round.explanation}</p>
          <Button className="w-full" size="lg" onClick={handleNext}>
            {currentRound + 1 >= game.totalRounds ? '🏆 Finish!' : 'Next Round →'}
          </Button>
        </div>
      )}

      {/* Hint button */}
      {phase === 'playing' && round.hint && (
        <div className="px-5 pb-4">
          {hintVisible ? (
            <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-800 border border-amber-200 animate-fade-in">
              💡 Hint: {round.hint}
            </div>
          ) : (
            <button onClick={() => setHintVisible(true)} className="text-sm text-gray-400 hover:text-brand-600 font-medium underline-offset-2 hover:underline">
              Need a hint?
            </button>
          )}
        </div>
      )}
    </div>
  );
}
