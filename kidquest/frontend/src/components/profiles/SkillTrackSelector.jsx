import React from 'react';
import { SKILL_TRACKS, SPORTS_LIST } from '../../utils/skillTracks.js';

export function SkillTrackSelector({ selectedTracks, sportDetail, onTracksChange, onSportChange }) {
  const toggle = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      onTracksChange(selectedTracks.filter((t) => t !== trackId));
      if (trackId === 'Sports') onSportChange('');
    } else {
      onTracksChange([...selectedTracks, trackId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {SKILL_TRACKS.map((track) => {
          const active = selectedTracks.includes(track.id);
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => toggle(track.id)}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 font-semibold text-sm transition-all
                ${active ? `${track.color} border-current scale-[1.02] shadow-sm` : 'bg-gray-50 border-gray-200 text-gray-600'}`}
            >
              <span className="text-2xl">{track.emoji}</span>
              <span className="text-left leading-tight">{track.label}</span>
            </button>
          );
        })}
      </div>

      {selectedTracks.includes('Sports') && (
        <div className="animate-fade-in">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Which sport? 🏅</label>
          <div className="grid grid-cols-2 gap-2">
            {SPORTS_LIST.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => onSportChange(sport.id)}
                className={`flex items-center gap-2 p-2 rounded-xl border-2 text-sm font-medium transition-all
                  ${sportDetail === sport.id ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                <span>{sport.emoji}</span> {sport.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
