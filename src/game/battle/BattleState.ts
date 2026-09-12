import type { BattleEvent } from './BattleEvent';

export type PokemonId = string;
export type MoveId = string;

export type StatusCondition =
  | 'burn'
  | 'freeze'
  | 'paralysis'
  | 'poison'
  | 'sleep'
  | 'none';

export interface BattleMove {
  id: MoveId;
  name: string;
  type: string;
  category: 'physical' | 'special' | 'status';
  /** Base power; undefined or 0 for status moves. */
  power?: number;
  /** Accuracy as a percentage (e.g. 85 = 85 %). Undefined = always hits. */
  accuracy?: number;
  currentPP: number;
  maxPP: number;
  /** Move priority bracket (0 = normal, +1 = Quick Attack, etc.). */
  priority: number;
  /** Optional effect tag, e.g. 'paralysis', 'burn', 'sleep'. */
  effect?: string;
}

export interface BattlePokemon {
  id: PokemonId;
  name: string;
  currentHp: number;
  maxHp: number;
  level: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  types: string[];
  moves: BattleMove[];
  status?: StatusCondition;
  isActive: boolean;
  /** Remaining turns of sleep (decremented each turn the Pokémon tries to move). */
  sleepTurns?: number;
}

export interface BattleSide {
  pokemon: BattlePokemon[];
  activeIndex: number;
  /** Identifies which side this is so resolvers can emit correctly-sided events. */
  id: 'player' | 'enemy';
}

export type BattlePhase = 'selecting' | 'executing' | 'ended';

export interface BattleState {
  id: string;
  player: BattleSide;
  enemy: BattleSide;
  turn: number;
  seed: string;
  log: BattleEvent[];
  phase: BattlePhase;
  winner?: 'player' | 'enemy';
}
