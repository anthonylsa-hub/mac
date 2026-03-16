import React from 'react';

export function LocationBadge({ place, onClear }) {
  if (!place) return null;
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-green-200">
      <span className="text-4xl">{place.emoji || '📍'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{place.placeName || place.label}</p>
        <p className="text-sm text-green-600 font-medium">{place.label || place.placeType}</p>
      </div>
      {onClear && (
        <button onClick={onClear} className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2">✕</button>
      )}
    </div>
  );
}
