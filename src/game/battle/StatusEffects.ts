import type { BattlePokemon, StatusCondition } from './BattleState';
import { BattleRandom } from './Random';

/**
 * Determines whether a Pokémon is able to move this turn given its status.
 * May mutate `pokemon.status` and `pokemon.sleepTurns` as a side-effect
 * (e.g., waking up from sleep).
 */
export function canMove(pokemon: BattlePokemon, rng: BattleRandom): boolean {
  switch (pokemon.status) {
    case 'freeze':
      // Frozen Pokémon cannot move.
      // A 20 % thaw chance is applied each turn the Pokémon tries to act.
      if (rng.chance(0.2)) {
        pokemon.status = 'none';
        pokemon.sleepTurns = undefined;
        return true; // thawed — can act this turn
      }
      return false;

    case 'paralysis':
      // 25 % chance of being fully paralysed.
      return !rng.chance(0.25);

    case 'sleep': {
      const remaining = pokemon.sleepTurns ?? 0;
      if (remaining <= 0) {
        // Wake up.
        pokemon.status = 'none';
        pokemon.sleepTurns = undefined;
        return true; // woke up — can act this turn (Gen III behaviour)
      }
      pokemon.sleepTurns = remaining - 1;
      return false;
    }

    default:
      return true;
  }
}

/**
 * Applies end-of-turn status damage for burn and poison.
 * Mutates `pokemon.currentHp` (clamped to 0).
 * Returns null when the status causes no end-of-turn damage.
 */
export function applyEndOfTurnStatus(
  pokemon: BattlePokemon,
): { damage: number; message: string } | null {
  if (pokemon.currentHp <= 0) return null;

  switch (pokemon.status) {
    case 'burn': {
      const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
      pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      return { damage, message: `${pokemon.name} is hurt by its burn!` };
    }

    case 'poison': {
      const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
      pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      return { damage, message: `${pokemon.name} is hurt by poison!` };
    }

    default:
      return null;
  }
}

/** Type immunities for status conditions in Gen III. */
const STATUS_IMMUNITIES: Partial<Record<StatusCondition, string[]>> = {
  burn:      ['Fire'],
  freeze:    ['Ice'],
  paralysis: ['Electric'],
  poison:    ['Poison', 'Steel'],
};

/**
 * Attempts to apply a status condition to a Pokémon.
 * Returns false if the Pokémon already has a (non-none) status
 * or if its type grants immunity to that status.
 * Mutates `pokemon.status` (and `pokemon.sleepTurns` for sleep) on success.
 */
export function applyStatus(
  pokemon: BattlePokemon,
  status: StatusCondition,
): boolean {
  // Already has a status.
  if (pokemon.status && pokemon.status !== 'none') return false;

  // Type-based immunity check.
  const immuneTypes = STATUS_IMMUNITIES[status];
  if (immuneTypes) {
    const isImmune = pokemon.types.some((t) => immuneTypes.includes(t));
    if (isImmune) return false;
  }

  pokemon.status = status;

  // Initialise sleep counter (3 turns; without rng access we use a fixed value).
  if (status === 'sleep') {
    pokemon.sleepTurns = 3;
  }

  return true;
}
