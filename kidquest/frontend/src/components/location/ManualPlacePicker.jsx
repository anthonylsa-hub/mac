import React from 'react';
import { PLACE_TYPES } from '../../utils/placeTypes.js';

export function ManualPlacePicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PLACE_TYPES.map((place) => (
        <button
          key={place.id}
          type="button"
          onClick={() => onSelect({ ...place, placeType: place.id, placeName: place.label, placeDescription: place.description, method: 'manual' })}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-semibold text-sm transition-all
            ${selected?.placeType === place.id
              ? 'border-brand-500 bg-brand-50 scale-[1.03] shadow-md text-brand-800'
              : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50'
            }`}
        >
          <span className="text-3xl">{place.emoji}</span>
          <span className="text-center leading-tight">{place.label}</span>
        </button>
      ))}
    </div>
  );
}
