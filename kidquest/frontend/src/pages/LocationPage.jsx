import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AppShell } from '../components/layout/AppShell.jsx';
import { LocationDetector } from '../components/location/LocationDetector.jsx';
import { ManualPlacePicker } from '../components/location/ManualPlacePicker.jsx';
import { LocationBadge } from '../components/location/LocationBadge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { useProfiles } from '../hooks/useProfiles.js';
import { useGame } from '../context/GameContext.jsx';
import { generateGame } from '../api/gamesApi.js';
import { getPlaceInfo } from '../utils/placeTypes.js';

export function LocationPage() {
  const navigate = useNavigate();
  const { selectedProfile } = useProfiles();
  const { startSession, setGame, setError } = useGame();
  const [resolvedPlace, setResolvedPlace] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const handlePlaceResolved = useCallback((place) => {
    setResolvedPlace(place);
    setShowManual(false);
  }, []);

  const handleManualSelect = useCallback((place) => {
    const info = getPlaceInfo(place.placeType);
    setResolvedPlace({ ...place, emoji: info.emoji, label: info.label });
    setShowManual(false);
  }, []);

  const handleGenerate = async () => {
    if (!selectedProfile || !resolvedPlace) return;
    setIsGenerating(true);
    setGenError(null);
    startSession({ profile: selectedProfile, location: resolvedPlace });
    try {
      const result = await generateGame({
        profile: {
          age: selectedProfile.age,
          skillTracks: selectedProfile.skillTracks,
          sportDetail: selectedProfile.sportDetail,
        },
        location: {
          placeType: resolvedPlace.placeType,
          placeName: resolvedPlace.placeName || resolvedPlace.label,
          placeDescription: resolvedPlace.placeDescription || resolvedPlace.description || '',
        },
        sessionId: uuidv4(),
      });
      setGame(result.game);
      navigate('/game');
    } catch (err) {
      const msg = err.message || 'Could not generate game. Please try again.';
      setGenError(msg);
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedProfile) {
    return (
      <AppShell title="Where Are You?">
        <div className="flex flex-col items-center justify-center h-64 gap-4 p-5">
          <p className="text-gray-600 text-center font-medium">No child profile selected. Go back and select a child first.</p>
          <Button variant="secondary" onClick={() => navigate('/')}>Go to Profiles</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Where Are You?">
      <div className="p-5 space-y-6">
        {/* Selected profile pill */}
        <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-brand-100">
          <span className="text-3xl">{selectedProfile.avatar}</span>
          <div>
            <p className="font-bold text-gray-900">{selectedProfile.name}</p>
            <p className="text-sm text-gray-500">Age {selectedProfile.age} · {selectedProfile.skillTracks?.join(', ')}</p>
          </div>
        </div>

        {/* Auto-detect */}
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Auto-detect location</p>
          <LocationDetector onPlaceResolved={handlePlaceResolved} />
        </div>

        {/* Current selection */}
        {resolvedPlace && !showManual && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Detected place</p>
            <LocationBadge place={resolvedPlace} onClear={() => setResolvedPlace(null)} />
            <button onClick={() => setShowManual(true)} className="text-sm text-brand-600 font-semibold hover:underline">
              Choose a different place →
            </button>
          </div>
        )}

        {/* Manual picker toggle */}
        {!resolvedPlace && !showManual && (
          <button onClick={() => setShowManual(true)} className="text-sm text-brand-600 font-semibold hover:underline">
            Or pick your location manually →
          </button>
        )}

        {showManual && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Choose your place</p>
              {resolvedPlace && <button onClick={() => setShowManual(false)} className="text-sm text-brand-600 font-semibold">Cancel</button>}
            </div>
            <ManualPlacePicker selected={resolvedPlace} onSelect={handleManualSelect} />
          </div>
        )}

        {/* Error */}
        {genError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {genError}
          </div>
        )}

        {/* Generate button */}
        {resolvedPlace && !showManual && (
          <div className="pt-2">
            <Button size="xl" className="w-full shadow-xl" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <><Spinner size="sm" /> Generating game...</> : '🎮 Generate Game!'}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
