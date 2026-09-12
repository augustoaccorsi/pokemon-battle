export interface UseMove {
  type: 'MOVE';
  /** Index into the active Pokémon's moves array. */
  moveIndex: number;
}

export interface SwitchPokemon {
  type: 'SWITCH';
  /** Index into the side's pokemon array. */
  pokemonIndex: number;
}

export type BattleAction = UseMove | SwitchPokemon;
