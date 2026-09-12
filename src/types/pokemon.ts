// Team-builder specific types.
// Core Pokémon types (PokemonListItem, PokemonDetail, etc.) live in @/types/index.ts

export interface RandomFilters {
  generations: number[];
  fullyEvolved: boolean;
  allowLegendary: boolean;
}

export interface RandomTeamRequest {
  generations?: number[];
  fullyEvolved?: boolean;
  allowLegendary?: boolean;
  types?: string[];
}

export interface SaveTeamRequest {
  name?: string;
  pokemonIds: number[];
}
