import { config } from '../config/index.js';
import { resolveGoogleType, getPlaceInfo } from '../utils/placeTypes.js';

export async function resolveLocation(latitude, longitude, radius = 100) {
  if (!config.googlePlacesApiKey) {
    return { resolved: false, message: 'Google Places API key not configured.' };
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${latitude},${longitude}`);
  url.searchParams.set('radius', String(radius));
  url.searchParams.set('rankby', 'prominence');
  url.searchParams.set('key', config.googlePlacesApiKey);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw Object.assign(new Error('Google Places API request failed'), { status: 502 });
  }

  const data = await resp.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw Object.assign(new Error(`Google Places error: ${data.status}`), { status: 502 });
  }

  const results = data.results || [];
  const allNearby = [];

  for (const place of results.slice(0, 5)) {
    const kidquestType = resolveGoogleType(place.types || []);
    if (kidquestType) {
      allNearby.push({
        name: place.name,
        type: kidquestType,
        distance: place.geometry?.location
          ? Math.round(haversineDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng))
          : null,
      });
    }
  }

  if (allNearby.length === 0) {
    return { resolved: false, message: 'No recognized place type found nearby.' };
  }

  const best = allNearby[0];
  const placeInfo = getPlaceInfo(best.type);

  return {
    resolved: true,
    placeType: best.type,
    placeName: results.find(r => resolveGoogleType(r.types) === best.type)?.name || best.name,
    placeDescription: placeInfo.description,
    confidence: 'high',
    allNearby,
  };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
