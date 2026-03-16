export const PLACE_TYPES = [
  { id: 'grocery_store', label: 'Grocery Store', emoji: '🛒', description: 'A grocery store filled with colorful food, fresh produce, and interesting products on shelves' },
  { id: 'park', label: 'Park', emoji: '🌳', description: 'An outdoor park with open spaces, trees, grass, and nature all around' },
  { id: 'museum', label: 'Museum', emoji: '🏛️', description: 'A museum with fascinating exhibits, artifacts, and displays to explore' },
  { id: 'library', label: 'Library', emoji: '📚', description: 'A quiet library full of books, stories, and knowledge on every shelf' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', description: 'A restaurant with delicious food, different flavors, and a busy kitchen' },
  { id: 'zoo', label: 'Zoo', emoji: '🦒', description: 'A zoo with amazing animals from around the world, each with unique features' },
  { id: 'beach', label: 'Beach', emoji: '🏖️', description: 'A sandy beach with waves, shells, sea creatures, and the vast ocean' },
  { id: 'playground', label: 'Playground', emoji: '🛝', description: 'A fun playground with equipment, open space to run, and activities to explore' },
  { id: 'sports_field', label: 'Sports Field', emoji: '⚽', description: 'A sports venue with fields, courts, or tracks designed for athletic activities' },
  { id: 'home', label: 'Home', emoji: '🏠', description: 'A cozy home with different rooms, everyday objects, and familiar surroundings' },
  { id: 'school', label: 'School', emoji: '🏫', description: 'A school with classrooms, learning materials, books, and educational tools' },
  { id: 'mall', label: 'Shopping Mall', emoji: '🏬', description: 'A shopping mall with many stores, bright signs, lots of people, and varied products' },
  { id: 'airport', label: 'Airport', emoji: '✈️', description: 'A busy airport with airplanes, gates, travelers, and signs from all over the world' },
  { id: 'doctor', label: "Doctor's Office", emoji: '🏥', description: 'A medical office with health posters, equipment, and helpful doctors and nurses' },
];

export function getPlaceInfo(placeType) {
  return PLACE_TYPES.find(p => p.id === placeType) || { id: placeType, label: placeType, emoji: '📍', description: '' };
}
