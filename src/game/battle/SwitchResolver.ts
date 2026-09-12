import type { BattleSide } from './BattleState';
import type { BattleEvent } from './BattleEvent';

/**
 * Resolves a switch action for the given side.
 *
 * Validates:
 *   - `targetIndex` is a valid index in the side's pokemon array
 *   - The target Pokémon has not fainted
 *   - The target Pokémon is not already the active one
 *
 * On success, updates `side.activeIndex` and the `isActive` flags on
 * both the outgoing and incoming Pokémon.
 *
 * @param sideId  Which side is switching (for event metadata).
 */
export function resolveSwitch(
  side: BattleSide,
  sideId: 'player' | 'enemy',
  targetIndex: number,
): BattleEvent[] {
  const target = side.pokemon[targetIndex];

  // Validation
  if (!target) return [];
  if (target.currentHp <= 0) return [];            // fainted — cannot be sent out
  if (targetIndex === side.activeIndex) return [];  // already active

  const outgoing = side.pokemon[side.activeIndex];

  // Update flags
  outgoing.isActive = false;
  target.isActive   = true;
  side.activeIndex  = targetIndex;

  return [
    {
      type: 'SWITCH',
      side: sideId,
      outPokemon: outgoing.name,
      inPokemon:  target.name,
    },
  ];
}
