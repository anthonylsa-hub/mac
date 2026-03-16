import React from 'react';
import { Badge } from '../ui/Badge.jsx';
import { getPlaceInfo } from '../../utils/placeTypes.js';

export function GameHeader({ game, location, currentRound, score }) {
  const placeInfo = location ? getPlaceInfo(location.placeType) : null;
  const progress = Math.round((currentRound / game.totalRounds) * 100);

  return (
    <div className="bg-white border-b border-purple-100 px-5 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{game.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{game.description}</p>
        </div>
        {placeInfo && (
          <Badge color="gray" className="shrink-0">
            {placeInfo.emoji} {placeInfo.label}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-600 shrink-0">
          {currentRound}/{game.totalRounds}
        </span>
        <span className="text-sm font-bold text-green-600 shrink-0">⭐ {score}</span>
      </div>
    </div>
  );
}
