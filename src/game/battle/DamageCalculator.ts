import { getCombinedEffectiveness } from './TypeChart';
import type { BattlePokemon, BattleMove } from './BattleState';
import { BattleRandom } from './Random';

export interface DamageParams {
  attacker: BattlePokemon;
  move: BattleMove;
  defender: BattlePokemon;
}

export interface DamageResult {
  damage: number;
  critical: boolean;
  /** Combined effectiveness multiplier (may be 0, 0.25, 0.5, 1, 2, 4 for dual types). */
  effectiveness: number;
  stab: boolean;
}

/**
 * Gen III damage formula:
 *
 *   damage = floor( floor( floor(2*level/5 + 2) * power * A/D / 50 ) + 2 ) * modifier
 *
 * where modifier = STAB x effectiveness x critical x random
 *
 * - STAB  = 1.5 if the attacker shares the move's type, else 1
 * - crit  = 1.5 (base rate 1/16 in Gen III)
 * - random = uniform integer [85, 100] / 100, applied last
 */
export function calculateDamage(
  params: DamageParams,
  rng: BattleRandom,
): DamageResult {
  const { attacker, move, defender } = params;

  const power = move.power ?? 0;

  if (power <= 0) {
    return { damage: 0, critical: false, effectiveness: 1, stab: false };
  }

  // stats — flat fields on BattlePokemon (not nested under .stats)
  const A =
    move.category === 'physical' ? attacker.attack : attacker.spAttack;
  const D =
    move.category === 'physical' ? defender.defense : defender.spDefense;

  // type effectiveness
  const effectiveness = getCombinedEffectiveness(move.type, defender.types);

  // immune: short-circuit
  if (effectiveness === 0) {
    return { damage: 0, critical: false, effectiveness: 0, stab: false };
  }

  // STAB
  const stab = attacker.types.includes(move.type);
  const stabMultiplier = stab ? 1.5 : 1;

  // critical (1/16 = 6.25 %)
  const critical = rng.chance(1 / 16);
  const critMultiplier = critical ? 1.5 : 1;

  // random factor [85, 100] / 100
  const random = rng.nextInt(85, 100) / 100;

  // base damage (three nested floors)
  const step1 = Math.floor((2 * attacker.level) / 5 + 2);
  const step2 = Math.floor((step1 * power * A) / D / 50);
  const baseDamage = step2 + 2;

  // apply modifier (single final floor)
  const modifier = stabMultiplier * effectiveness * critMultiplier * random;
  const damage = Math.max(1, Math.floor(baseDamage * modifier));

  return { damage, critical, effectiveness, stab };
}
