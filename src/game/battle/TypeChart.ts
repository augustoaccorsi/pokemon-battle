/**
 * Gen III type effectiveness chart (all 17 types × 17 types).
 * Chart key: CHART[attackingType][defendingType] → multiplier
 * Only non-1 values are stored; missing entries default to 1.
 */

export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel';

type ChartMultiplier = 0 | 0.5 | 2;

/** Sparse map: only non-1.0 matchups are recorded. */
const CHART: Readonly<Record<PokemonType, Partial<Record<PokemonType, ChartMultiplier>>>> = {
  Normal: {
    Rock: 0.5,
    Ghost: 0,
    Steel: 0.5,
  },
  Fire: {
    Fire: 0.5,
    Water: 0.5,
    Rock: 0.5,
    Dragon: 0.5,
    Grass: 2,
    Ice: 2,
    Bug: 2,
    Steel: 2,
  },
  Water: {
    Water: 0.5,
    Grass: 0.5,
    Dragon: 0.5,
    Fire: 2,
    Ground: 2,
    Rock: 2,
  },
  Electric: {
    Electric: 0.5,
    Grass: 0.5,
    Dragon: 0.5,
    Ground: 0,
    Water: 2,
    Flying: 2,
  },
  Grass: {
    Fire: 0.5,
    Grass: 0.5,
    Poison: 0.5,
    Flying: 0.5,
    Bug: 0.5,
    Dragon: 0.5,
    Steel: 0.5,
    Water: 2,
    Ground: 2,
    Rock: 2,
  },
  Ice: {
    Water: 0.5,
    Ice: 0.5,
    Steel: 0.5,
    Grass: 2,
    Ground: 2,
    Flying: 2,
    Dragon: 2,
  },
  Fighting: {
    Poison: 0.5,
    Flying: 0.5,
    Psychic: 0.5,
    Bug: 0.5,
    Ghost: 0,
    Normal: 2,
    Ice: 2,
    Rock: 2,
    Dark: 2,
    Steel: 2,
  },
  Poison: {
    Poison: 0.5,
    Ground: 0.5,
    Rock: 0.5,
    Ghost: 0.5,
    Steel: 0,
    Grass: 2,
  },
  Ground: {
    Grass: 0.5,
    Bug: 0.5,
    Flying: 0,
    Fire: 2,
    Electric: 2,
    Poison: 2,
    Rock: 2,
    Steel: 2,
  },
  Flying: {
    Electric: 0.5,
    Rock: 0.5,
    Steel: 0.5,
    Grass: 2,
    Fighting: 2,
    Bug: 2,
  },
  Psychic: {
    Psychic: 0.5,
    Steel: 0.5,
    Dark: 0,
    Fighting: 2,
    Poison: 2,
  },
  Bug: {
    Fire: 0.5,
    Fighting: 0.5,
    Flying: 0.5,
    Ghost: 0.5,
    Steel: 0.5,
    Grass: 2,
    Psychic: 2,
    Dark: 2,
  },
  Rock: {
    Fighting: 0.5,
    Ground: 0.5,
    Steel: 0.5,
    Fire: 2,
    Ice: 2,
    Flying: 2,
    Bug: 2,
  },
  Ghost: {
    Normal: 0,
    Dark: 0.5,
    Steel: 0.5,
    Psychic: 2,
    Ghost: 2,
  },
  Dragon: {
    Steel: 0.5,
    Dragon: 2,
  },
  Dark: {
    Fighting: 0.5,
    Dark: 0.5,
    Steel: 0.5,
    Psychic: 2,
    Ghost: 2,
  },
  Steel: {
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Steel: 0.5,
    Ice: 2,
    Rock: 2,
  },
} as const;

/**
 * Returns the type effectiveness multiplier for a single attacker → defender matchup.
 * Unknown type strings return 1 (neutral).
 */
export function getTypeEffectiveness(
  attackType: string,
  defendType: string,
): 0 | 0.5 | 1 | 2 {
  const row = CHART[attackType as PokemonType];
  if (!row) return 1;
  const value = row[defendType as PokemonType];
  return value ?? 1;
}

/**
 * Returns the combined effectiveness multiplier against a potentially dual-type defender.
 * Can produce 0, 0.25, 0.5, 1, 2, or 4 for dual-type matchups.
 */
export function getCombinedEffectiveness(
  attackType: string,
  defendTypes: string[],
): number {
  return defendTypes.reduce(
    (acc, dt) => acc * getTypeEffectiveness(attackType, dt),
    1,
  );
}
