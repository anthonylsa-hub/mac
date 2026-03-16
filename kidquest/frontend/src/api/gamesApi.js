export async function generateGame({ profile, location, sessionId }) {
  const res = await fetch('/api/games/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, location, sessionId }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'Failed to generate game');
    err.retryable = data.retryable ?? true;
    throw err;
  }
  return data;
}
