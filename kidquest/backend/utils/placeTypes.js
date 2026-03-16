// Maps Google Places API types to KidQuest normalized place types
export const GOOGLE_TO_KIDQUEST = {
  supermarket: 'grocery_store',
  grocery_or_supermarket: 'grocery_store',
  convenience_store: 'grocery_store',
  food: 'restaurant',
  restaurant: 'restaurant',
  cafe: 'restaurant',
  bakery: 'restaurant',
  meal_takeaway: 'restaurant',
  park: 'park',
  natural_feature: 'park',
  campground: 'park',
  museum: 'museum',
  art_gallery: 'museum',
  aquarium: 'museum',
  library: 'library',
  book_store: 'library',
  zoo: 'zoo',
  amusement_park: 'playground',
  playground: 'playground',
  school: 'school',
  university: 'school',
  primary_school: 'school',
  secondary_school: 'school',
  shopping_mall: 'mall',
  department_store: 'mall',
  clothing_store: 'mall',
  airport: 'airport',
  hospital: 'doctor',
  doctor: 'doctor',
  dentist: 'doctor',
  health: 'doctor',
  gym: 'sports_field',
  stadium: 'sports_field',
  sports_complex: 'sports_field',
  beach: 'beach',
  home: 'home',
};

export const KIDQUEST_PLACE_INFO = {
  grocery_store: {
    emoji: '🛒',
    label: 'Grocery Store',
    description: 'A grocery store filled with colorful food, fresh produce, and interesting products on shelves',
  },
  park: {
    emoji: '🌳',
    label: 'Park',
    description: 'An outdoor park with open spaces, trees, grass, and nature all around',
  },
  museum: {
    emoji: '🏛️',
    label: 'Museum',
    description: 'A museum with fascinating exhibits, artifacts, and displays to explore',
  },
  library: {
    emoji: '📚',
    label: 'Library',
    description: 'A quiet library full of books, stories, and knowledge on every shelf',
  },
  restaurant: {
    emoji: '🍽️',
    label: 'Restaurant',
    description: 'A restaurant with delicious food, different flavors, and a busy kitchen',
  },
  zoo: {
    emoji: '🦒',
    label: 'Zoo',
    description: 'A zoo with amazing animals from around the world, each with unique features',
  },
  beach: {
    emoji: '🏖️',
    label: 'Beach',
    description: 'A sandy beach with waves, shells, sea creatures, and the vast ocean',
  },
  playground: {
    emoji: '🛝',
    label: 'Playground',
    description: 'A fun playground with equipment, open space to run, and activities to explore',
  },
  sports_field: {
    emoji: '⚽',
    label: 'Sports Field',
    description: 'A sports venue with fields, courts, or tracks designed for athletic activities',
  },
  home: {
    emoji: '🏠',
    label: 'Home',
    description: 'A cozy home with different rooms, everyday objects, and familiar surroundings',
  },
  school: {
    emoji: '🏫',
    label: 'School',
    description: 'A school with classrooms, learning materials, books, and educational tools',
  },
  mall: {
    emoji: '🏬',
    label: 'Shopping Mall',
    description: 'A shopping mall with many stores, bright signs, lots of people, and varied products',
  },
  airport: {
    emoji: '✈️',
    label: 'Airport',
    description: 'A busy airport with airplanes, gates, travelers, and signs from all over the world',
  },
  doctor: {
    emoji: '🏥',
    label: "Doctor's Office",
    description: "A medical office with health posters, equipment, and helpful doctors and nurses",
  },
};

export const ALL_KIDQUEST_TYPES = Object.keys(KIDQUEST_PLACE_INFO);

export function resolveGoogleType(googleTypes = []) {
  for (const gType of googleTypes) {
    const kidquestType = GOOGLE_TO_KIDQUEST[gType];
    if (kidquestType) return kidquestType;
  }
  return null;
}

export function getPlaceInfo(placeType) {
  return KIDQUEST_PLACE_INFO[placeType] || {
    emoji: '📍',
    label: placeType,
    description: `A ${placeType} with interesting things to see and explore`,
  };
}
