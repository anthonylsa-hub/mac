import 'dotenv/config';

const required = (name) => {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
};

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
};
