export type BattleEventType =
  | 'MOVE_USED'
  | 'DAMAGE'
  | 'FAINT'
  | 'SWITCH'
  | 'MISSED'
  | 'STATUS'
  | 'END_OF_TURN_DAMAGE'
  | 'VICTORY'
  | 'DEFEAT'
  | 'CRITICAL_HIT';

export interface BattleEvent {
  type: BattleEventType;
  sourceId?: string;
  targetId?: string;
  moveId?: string;
  amount?: number;
  status?: string;
  switchInId?: string;
  [key: string]: unknown;
}

export type StatusCondition = 'burn' | 'paralysis' | 'poison' | 'sleep' | 'freeze' | null;

export interface BattleMove {
  id: string;
  name: string;
  type: string;
  power: number;
  accuracy: number; // 0-100, 0 = never misses
  pp: number;
  maxPp: number;
  category: 'physical' | 'special' | 'status';
  priority: number;
}

export interface BattlePokemon {
  id: string;
  name: string;
  types: string[];
  level: number;
  hp: number;
  maxHp: number;
  stats: {
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  moves: BattleMove[];
  status: StatusCondition;
  fainted: boolean;
}

export interface BattleSide {
  pokemon: BattlePokemon[];
  activeIndex: number;
}

export interface BattleState {
  player: BattleSide;
  opponent: BattleSide;
  turn: number;
  weather: string | null;
  log: BattleEvent[];
}

export type BattleActionType = 'MOVE' | 'SWITCH';

export interface BattleAction {
  type: BattleActionType;
  /** Index of the move in the active pokemon's moves array (for MOVE actions) */
  moveIndex?: number;
  /** Index of the pokemon to switch in (for SWITCH actions) */
  switchIndex?: number;
  /** Which side is acting: 'player' | 'opponent' */
  side: 'player' | 'opponent';
}
