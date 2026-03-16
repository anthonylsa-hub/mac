const AGE_BANDS = [
  { label: 'Toddler', min: 1, max: 2, rules: 'Use ONLY colors, shapes, animal sounds, and counting to 5. Maximum 2-word answers. Use lots of emojis in prompts.' },
  { label: 'Little Explorer', min: 3, max: 4, rules: 'Use simple words, basic letters, counting to 10, and colors. Short sentences. Very encouraging language.' },
  { label: 'Junior', min: 5, max: 7, rules: 'Can read simple words, basic math (add/subtract to 20), pattern recognition, and simple cause-and-effect.' },
  { label: 'Thinker', min: 8, max: 10, rules: 'Use multi-step reasoning, estimation, scientific observation, strategy, and vocabulary building.' },
  { label: 'Preteen', min: 11, max: 12, rules: 'Challenge with deductive reasoning, complex patterns, advanced vocabulary, and analytical thinking.' },
];

const SKILL_TRACK_GUIDANCE = {
  Sports: (sport) => sport
    ? `Focus on skills relevant to ${sport}: ${getSportSkills(sport)}`
    : 'Focus on motor skills, coordination, reaction time, spatial awareness, and strategic thinking.',
  STEM: () => 'Focus on observation, hypothesis, cause-and-effect, counting, measurement, categorization, and scientific curiosity.',
  Arts: () => 'Focus on color recognition, pattern identification, creativity, storytelling, rhythm, and aesthetic observation.',
  Social: () => 'Focus on empathy, sharing, teamwork, communication, reading emotions, and cooperative problem-solving.',
};

function getSportSkills(sport) {
  const skills = {
    tennis: 'tracking moving objects, predicting ball trajectories, reaction time, spatial awareness, focus, and strategy',
    soccer: 'spatial awareness, teamwork, direction, coordination, prediction, and strategy',
    basketball: 'aim and distance estimation, coordination, teamwork, strategy, and spatial reasoning',
    swimming: 'rhythm, breathing patterns, coordination, endurance thinking, and body awareness',
    gymnastics: 'balance, flexibility concepts, pattern and sequence recognition, body coordination',
    baseball: 'tracking moving objects, timing, direction, spatial awareness, and hand-eye coordination',
    running: 'pace, endurance concepts, rhythm, and determination',
    general: 'motor skills, coordination, focus, spatial awareness, and strategic thinking',
  };
  return skills[sport.toLowerCase()] || skills.general;
}

function getAgeBand(age) {
  return AGE_BANDS.find(b => age >= b.min && age <= b.max) || AGE_BANDS[AGE_BANDS.length - 1];
}

const GAME_TYPE_GUIDANCE = `
Choose the game type that BEST fits the age and context:
- "multiple_choice": prediction questions, sports strategy, science concepts (works all ages)
- "tap_to_select": color/shape/category hunts — BEST for ages 1-6 in real environments
- "matching": vocabulary pairs, cause-effect links, word-image matching — BEST for ages 4-10
- "observation": checklist tasks in real environment — BEST for museums, nature, STEM (ages 5+)
- "drag_and_drop": sorting and categorizing — BEST for ages 5-10

For ages 1-3: STRONGLY prefer "tap_to_select".
For museum/nature: STRONGLY prefer "observation".
`;

const OUTPUT_SCHEMA = `
Output ONLY a valid JSON object (no markdown, no explanation) matching this EXACT structure:

{
  "title": "Fun 2-4 word game name",
  "description": "One exciting sentence describing the game",
  "type": "multiple_choice|tap_to_select|matching|drag_and_drop|observation",
  "instructions": "2-3 simple sentences telling the child what to do",
  "rounds": [
    {
      "roundId": "r1",
      "prompt": "The question or task for this round",
      "explanation": "Short explanation after the answer (encouraging, educational)",
      "hint": "A helpful hint if child is stuck",

      // For multiple_choice ONLY — include "options":
      "options": [
        { "id": "a", "text": "Option text", "emoji": "😀", "isCorrect": true },
        { "id": "b", "text": "Option text", "emoji": "😐", "isCorrect": false }
      ],

      // For tap_to_select ONLY — include "items":
      "items": [
        { "id": "red", "label": "Red", "emoji": "🔴", "isTarget": true },
        { "id": "blue", "label": "Blue", "emoji": "🔵", "isTarget": false }
      ],

      // For matching ONLY — include "pairs":
      "pairs": [
        { "leftId": "l1", "leftLabel": "Cat", "leftEmoji": "🐱", "rightId": "r1", "rightLabel": "Meow", "rightEmoji": "💬" }
      ],

      // For observation ONLY — include "checklist":
      "checklist": [
        { "id": "c1", "text": "Find something round", "emoji": "⭕" }
      ],

      // For drag_and_drop ONLY — include "draggables" and "dropZones":
      "draggables": [
        { "id": "d1", "label": "Apple", "emoji": "🍎", "targetZoneId": "fruits" }
      ],
      "dropZones": [
        { "id": "fruits", "label": "Fruits", "emoji": "🍇" }
      ]
    }
  ],
  "completionMessage": "Celebratory message when game is done",
  "totalRounds": 3,
  "ageGroup": "age band label",
  "skillTrack": "primary skill track",
  "locationContext": "place type"
}

IMPORTANT: Only include the fields relevant to the chosen game type. Do NOT mix fields from different types.
`;

export function buildSystemPrompt() {
  return `You are KidQuest, an expert children's educational game designer. You create interactive, location-aware games for children aged 1-12.

ABSOLUTE RULES:
1. Output ONLY valid JSON — no markdown code blocks, no explanation, no preamble.
2. Never include violence, scary content, or adult concepts.
3. Make vocabulary and complexity match the child's exact age.
4. Games must be completable in 3-10 minutes without any equipment.
5. Every game MUST reference real, observable things at the stated location.
6. Be enthusiastic and encouraging in all text.
7. Use emojis generously in prompts and options for younger children.`;
}

export function buildUserPrompt({ profile, location }) {
  const { age, skillTracks = [], sportDetail } = profile;
  const { placeType, placeName, placeDescription } = location;
  const ageBand = getAgeBand(age);

  const trackGuidance = skillTracks
    .map(track => {
      const fn = SKILL_TRACK_GUIDANCE[track];
      return fn ? `- ${track}: ${fn(track === 'Sports' ? sportDetail : undefined)}` : '';
    })
    .filter(Boolean)
    .join('\n');

  return `GAME CONTEXT:
- Location: ${placeName} (type: ${placeType})
- Environment description: ${placeDescription}
- Child's age: ${age} years old (${ageBand.label})
- Age-appropriate complexity: ${ageBand.rules}
- Skill tracks to develop:
${trackGuidance || '- General learning and curiosity'}
- Number of rounds: 3

${GAME_TYPE_GUIDANCE}

CREATE a single educational game that:
1. Takes place entirely at or within "${placeName}"
2. Develops the skills listed above for a ${age}-year-old
3. Uses things the child can actually see, touch, or observe at this location
4. Is exciting and achievable for a ${ageBand.label}

${OUTPUT_SCHEMA}`;
}
