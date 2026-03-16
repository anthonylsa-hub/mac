import React, { useState } from 'react';
import { AgeSlider } from './AgeSlider.jsx';
import { SkillTrackSelector } from './SkillTrackSelector.jsx';
import { Button } from '../ui/Button.jsx';
import { AVATAR_OPTIONS } from '../../utils/skillTracks.js';

export function ProfileEditor({ profile, onSave, onCancel }) {
  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(profile?.age || 5);
  const [avatar, setAvatar] = useState(profile?.avatar || AVATAR_OPTIONS[0]);
  const [skillTracks, setSkillTracks] = useState(profile?.skillTracks || []);
  const [sportDetail, setSportDetail] = useState(profile?.sportDetail || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setError('Please enter a name.'); return; }
    if (skillTracks.length === 0) { setError('Please select at least one skill track.'); return; }
    onSave({ ...profile, name: name.trim(), age, avatar, skillTracks, sportDetail: sportDetail || undefined });
  };

  return (
    <div className="space-y-6">
      {/* Avatar picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Choose an avatar</label>
        <div className="flex flex-wrap gap-2">
          {AVATAR_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all
                ${avatar === a ? 'border-brand-500 bg-brand-50 scale-110' : 'border-gray-200 bg-white'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Child's name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Emma"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-brand-400 focus:outline-none text-lg font-medium"
          maxLength={30}
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Age</label>
        <AgeSlider value={age} onChange={setAge} />
      </div>

      {/* Skill tracks */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Skill tracks</label>
        <SkillTrackSelector
          selectedTracks={skillTracks}
          sportDetail={sportDetail}
          onTracksChange={setSkillTracks}
          onSportChange={setSportDetail}
        />
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSave} className="flex-1">Save Profile</Button>
      </div>
    </div>
  );
}
