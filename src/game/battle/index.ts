// ── Type chart ─────────────────────────────────────────────────────────────
export type { PokemonType } from './TypeChart';
export { getTypeEffectiveness, getCombinedEffectiveness } from './TypeChart';

// ── State types ────────────────────────────────────────────────────────────
export type {
  PokemonId,
  MoveId,
  StatusCondition,
  BattleMove,
  BattlePokemon,
  BattleSide,
  BattlePhase,
  BattleState,
} from './BattleState';

// ── Actions ────────────────────────────────────────────────────────────────
export type { UseMove, SwitchPokemon, BattleAction } from './BattleAction';

// ── Events ─────────────────────────────────────────────────────────────────
export type {
  MoveUsedEvent,
  SwitchEvent,
  FaintEvent,
  StatusEvent,
  BattleEndEvent,
  MissedEvent,
  BattleEvent,
} from './BattleEvent';

// ── RNG ────────────────────────────────────────────────────────────────────
export { BattleRandom } from './Random';

// ── Damage calculator ──────────────────────────────────────────────────────
export type { DamageParams, DamageResult } from './DamageCalculator';
export { calculateDamage } from './DamageCalculator';

// ── Status effects ─────────────────────────────────────────────────────────
export { canMove, applyEndOfTurnStatus, applyStatus } from './StatusEffects';

// ── Resolvers ──────────────────────────────────────────────────────────────
export { resolveMove } from './MoveResolver';
export { resolveSwitch } from './SwitchResolver';

// ── Battle engine ──────────────────────────────────────────────────────────
export { Battle } from './Battle';
