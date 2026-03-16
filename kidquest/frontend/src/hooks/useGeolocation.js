import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [status, setStatus] = useState('idle'); // idle | requesting | granted | denied | timeout
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setStatus('requesting');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus('granted');
      },
      (err) => {
        setError(err.message);
        setStatus(err.code === 1 ? 'denied' : 'timeout');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { status, coords, error, request };
}
