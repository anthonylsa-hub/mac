import { useState, useEffect } from 'react';
import { resolveLocation } from '../api/locationApi.js';

export function useLocationResolve(coords) {
  const [resolvedPlace, setResolvedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualOverride, setManualOverride] = useState(null);

  useEffect(() => {
    if (!coords || manualOverride) return;
    setIsLoading(true);
    setError(null);
    resolveLocation(coords)
      .then((data) => {
        if (data.resolved) setResolvedPlace(data);
        else setError('Could not identify this location automatically.');
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [coords, manualOverride]);

  const activePlace = manualOverride || resolvedPlace;

  return { resolvedPlace: activePlace, isLoading, error, manualOverride, setManualOverride };
}
