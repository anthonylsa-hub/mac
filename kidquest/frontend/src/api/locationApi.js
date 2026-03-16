export async function resolveLocation({ latitude, longitude, radius = 100 }) {
  const res = await fetch('/api/location/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude, radius }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Location resolve failed');
  return data;
}
