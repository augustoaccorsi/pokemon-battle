import type { BattlePokemon, BattleMove, StatusCondition } from './BattleState';
import type { BattleEvent, MoveUsedEvent } from './BattleEvent';
import { calculateDamage } from './DamageCalculator';
import { applyStatus } from './StatusEffects';
import { BattleRandom } from './Random';

/** Status tags that a move's `effect` field may carry. */
const STATUS_EFFECT_MAP: Record<string, StatusCondition> = {
  paralysis: 'paralysis',
  burn:      'burn',
  freeze:    'freeze',
  poison:    'poison',
  sleep:     'sleep',
};

/**
 * Buckets the raw combined effectiveness into the display values the UI needs.
 *   0     → 0   (immune)
 *   <1    → 0.5 (not very effective — includes 0.25)
 *   1     → 1   (neutral)
 *   >1    → 2   (super effective — includes 4)
 */
function toDisplayEffectiveness(e: number): 0 | 0.5 | 1 | 2 {
  if (e === 0) return 0;
  if (e < 1)  return 0.5;
  if (e > 1)  return 2;
  return 1;
}

/**
 * Resolves a single move use and returns the resulting BattleEvents.
 *
 * Side-effects on the provided objects:
 *   - Decrements `move.currentPP`
 *   - Reduces `defender.currentHp`
 *   - May mutate `defender.status` / `defender.sleepTurns` via applyStatus
 *
 * @param defenderSide  Which side the defender belongs to (needed for event fields).
 */
export function resolveMove(
  attacker: BattlePokemon,
  move: BattleMove,
  defender: BattlePokemon,
  defenderSide: 'player' | 'enemy',
  rng: BattleRandom,
): BattleEvent[] {
  const events: BattleEvent[] = [];

  // ── PP check ─────────────────────────────────────────────────────────────
  if (move.currentPP <= 0) {
    // No PP left — in a full implementation this becomes Struggle.
    // For now we simply produce no events (the caller should handle this case).
    return events;
  }

  // ── Decrement PP ──────────────────────────────────────────────────────────
  move.currentPP = Math.max(0, move.currentPP - 1);

  // ── Accuracy check ────────────────────────────────────────────────────────
  if (move.accuracy !== undefined) {
    if (!rng.chance(move.accuracy / 100)) {
      events.push({ type: 'MISSED', attacker: attacker.name, move: move.name });
      return events;
    }
  }

  // ── Damage ────────────────────────────────────────────────────────────────
  let damage = 0;
  let critical = false;
  let effectiveness = 1;

  if (move.power !== undefined && move.power > 0 && move.category !== 'status') {
    const result = calculateDamage({ attacker, move, defender }, rng);
    damage      = result.damage;
    critical    = result.critical;
    effectiveness = result.effectiveness;

    defender.currentHp = Math.max(0, defender.currentHp - damage);
  }

  const targetFainted = defender.currentHp <= 0;

  // ── MOVE_USED event ───────────────────────────────────────────────────────
  const moveEvent: MoveUsedEvent = {
    type: 'MOVE_USED',
    attacker: attacker.name,
    move: move.name,
    critical,
    effectiveness: toDisplayEffectiveness(effectiveness),
    targetFainted,
  };
  if (damage > 0) {
    moveEvent.damage = damage;
  }
  events.push(moveEvent);

  // ── Status effect ─────────────────────────────────────────────────────────
  // Only apply if the target is still standing and the move has a status tag.
  if (move.effect && !targetFainted) {
    const status = STATUS_EFFECT_MAP[move.effect];
    if (status) {
      const applied = applyStatus(defender, status);
      if (applied) {
        events.push({
          type: 'STATUS',
          side: defenderSide,
          pokemon: defender.name,
          status,
          applied: true,
        });
      }
    }
  }

  // ── Faint event ───────────────────────────────────────────────────────────
  if (targetFainted) {
    events.push({
      type: 'FAINT',
      side: defenderSide,
      pokemon: defender.name,
    });
  }

  return events;
}
