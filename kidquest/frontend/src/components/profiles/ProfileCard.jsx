import React from 'react';
import { Badge } from '../ui/Badge.jsx';
import { SKILL_TRACKS } from '../../utils/skillTracks.js';
import { getAgeBand } from '../../utils/ageGroups.js';

const trackColors = { Sports: 'green', STEM: 'blue', Arts: 'yellow', Social: 'pink' };

export function ProfileCard({ profile, isSelected, onSelect, onEdit, onDelete }) {
  const band = getAgeBand(profile.age);
  return (
    <div
      className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer
        ${isSelected ? 'border-brand-500 bg-brand-50 shadow-lg scale-[1.01]' : 'border-gray-200 bg-white hover:border-brand-300 hover:shadow-md'}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
      )}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-3xl shadow-sm">
          {profile.avatar || '👦'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-extrabold text-gray-900 truncate">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.age} years • {band.label}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.skillTracks?.map((t) => (
          <Badge key={t} color={trackColors[t] || 'gray'}>
            {SKILL_TRACKS.find(s => s.id === t)?.emoji} {t}
            {t === 'Sports' && profile.sportDetail ? ` (${profile.sportDetail})` : ''}
          </Badge>
        ))}
      </div>
      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={onEdit} className="text-xs text-brand-600 font-semibold hover:underline">Edit</button>
        <span className="text-gray-300">|</span>
        <button onClick={onDelete} className="text-xs text-red-500 font-semibold hover:underline">Remove</button>
      </div>
    </div>
  );
}
