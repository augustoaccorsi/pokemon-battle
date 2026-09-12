export interface MoveUsedEvent {
  type: 'MOVE_USED';
  attacker: string;
  move: string;
  /** Undefined for status moves that deal no damage. */
  damage?: number;
  critical: boolean;
  /**
   * Display effectiveness bucket.
   * Dual-type matchups that produce 0.25 or 4 are bucketed to 0.5 and 2 respectively.
   */
  effectiveness: 0 | 0.5 | 1 | 2;
  targetFainted: boolean;
}

export interface SwitchEvent {
  type: 'SWITCH';
  side: 'player' | 'enemy';
  outPokemon: string;
  inPokemon: string;
}

export interface FaintEvent {
  type: 'FAINT';
  side: 'player' | 'enemy';
  pokemon: string;
}

/**
 * Emitted when a status condition is applied (applied: true) or when it
 * triggers end-of-turn damage (applied: false).
 */
export interface StatusEvent {
  type: 'STATUS';
  side: 'player' | 'enemy';
  pokemon: string;
  status: string;
  applied: boolean;
}

export interface BattleEndEvent {
  type: 'BATTLE_END';
  winner: 'player' | 'enemy';
}

export interface MissedEvent {
  type: 'MISSED';
  attacker: string;
  move: string;
}

export type BattleEvent =
  | MoveUsedEvent
  | SwitchEvent
  | FaintEvent
  | StatusEvent
  | BattleEndEvent
  | MissedEvent;
