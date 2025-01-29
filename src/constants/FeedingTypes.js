export const PREY_TYPES = [
    'Mouse',
    'Rat',
    'Chick',
    'Cricket',
    'Mealworm',
    'Other'
  ] as const;
  
  export type PreyType = typeof PREY_TYPES[number];