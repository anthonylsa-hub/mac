export const AGE_BANDS = [
  { label: 'Toddler', min: 1, max: 2, emoji: '👶', description: 'Colors, shapes & sounds' },
  { label: 'Little Explorer', min: 3, max: 4, emoji: '🌟', description: 'Letters, numbers & words' },
  { label: 'Junior', min: 5, max: 7, emoji: '🚀', description: 'Reading, logic & patterns' },
  { label: 'Thinker', min: 8, max: 10, emoji: '🧠', description: 'Strategy & observation' },
  { label: 'Preteen', min: 11, max: 12, emoji: '🎓', description: 'Reasoning & analysis' },
];

export function getAgeBand(age) {
  return AGE_BANDS.find(b => age >= b.min && age <= b.max) || AGE_BANDS[AGE_BANDS.length - 1];
}
