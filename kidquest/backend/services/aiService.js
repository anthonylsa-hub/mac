import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/index.js';
import { buildSystemPrompt, buildUserPrompt } from './promptBuilder.js';
import { validateGame } from '../utils/gameValidator.js';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const ATTEMPTS = [
  { temperature: 0.8, label: 'creative' },
  { temperature: 0.3, label: 'focused' },
  { temperature: 0.1, label: 'strict' },
];

async function callClaude(systemPrompt, userPrompt, temperature) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content[0]?.text || '';
  // Strip any accidental markdown code fences
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateGame(profile, location) {
  const systemPrompt = buildSystemPrompt();
  let userPrompt = buildUserPrompt({ profile, location });
  let lastError = null;

  for (let i = 0; i < ATTEMPTS.length; i++) {
    const { temperature, label } = ATTEMPTS[i];
    try {
      console.log(`[AI] Attempt ${i + 1} (${label}, temp=${temperature})`);
      const raw = await callClaude(systemPrompt, userPrompt, temperature);
      // Inject context fields if AI omitted them
      raw.ageGroup = raw.ageGroup || String(profile.age);
      raw.skillTrack = raw.skillTrack || (profile.skillTracks?.[0] || 'General');
      raw.locationContext = raw.locationContext || location.placeType;
      const validated = validateGame(raw);
      console.log(`[AI] Success on attempt ${i + 1}: "${validated.title}"`);
      return validated;
    } catch (err) {
      lastError = err;
      console.warn(`[AI] Attempt ${i + 1} failed: ${err.message}`);
      // On subsequent attempts, add correction instruction
      if (i < ATTEMPTS.length - 1) {
        userPrompt = buildUserPrompt({ profile, location }) +
          `\n\nPREVIOUS ATTEMPT FAILED with error: "${err.message}". Ensure your output is ONLY a valid JSON object with no markdown.`;
      }
    }
  }

  throw Object.assign(new Error('Could not generate a valid game after 3 attempts'), {
    code: 'game_generation_failed',
    status: 422,
    cause: lastError,
    retryable: true,
  });
}
