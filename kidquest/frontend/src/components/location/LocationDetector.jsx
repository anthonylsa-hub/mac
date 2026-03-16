import React, { useEffect } from 'react';
import { Spinner } from '../ui/Spinner.jsx';
import { Button } from '../ui/Button.jsx';
import { LocationBadge } from './LocationBadge.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useLocationResolve } from '../../hooks/useLocationResolve.js';
import { getPlaceInfo } from '../../utils/placeTypes.js';

export function LocationDetector({ onPlaceResolved }) {
  const { status, coords, error: gpsError, request } = useGeolocation();
  const { resolvedPlace, isLoading, error: resolveError, setManualOverride } = useLocationResolve(coords);

  useEffect(() => { request(); }, [request]);

  useEffect(() => {
    if (resolvedPlace) {
      const info = getPlaceInfo(resolvedPlace.placeType);
      onPlaceResolved({ ...resolvedPlace, emoji: info.emoji, label: info.label });
    }
  }, [resolvedPlace, onPlaceResolved]);

  if (status === 'requesting' || isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <Spinner size="lg" />
        <p className="text-gray-500 font-medium animate-pulse-soft">Detecting your location...</p>
      </div>
    );
  }

  if (resolvedPlace) {
    const info = getPlaceInfo(resolvedPlace.placeType);
    return (
      <div className="space-y-3">
        <LocationBadge place={{ ...resolvedPlace, emoji: info.emoji, label: info.label }} />
        <button
          onClick={() => setManualOverride(null)}
          className="text-sm text-brand-600 font-semibold hover:underline"
        >
          Use a different place instead →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(gpsError || resolveError) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          {gpsError || resolveError} — Select your place below.
        </div>
      )}
      <Button variant="secondary" onClick={request} className="w-full">
        📍 Try GPS Again
      </Button>
    </div>
  );
}
