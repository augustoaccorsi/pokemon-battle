export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'

export interface PokemonListItem {
  id: number
  name: string
  types: PokemonType[]
  spriteFront?: string
  generation: number
}

export interface PokemonDetail extends PokemonListItem {
  height: number
  weight: number
  isLegendary: boolean
  hp: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
  abilities: { name: string; isHidden: boolean }[]
  moves: { name: string; type: PokemonType; learnMethod: string; level?: number }[]
  evolutions: {
    fromId: number
    fromName: string
    fromSprite?: string
    toId: number
    toName: string
    toSprite?: string
    trigger: string
    minLevel?: number
    itemName?: string
  }[]
  spriteBack?: string
  spriteFrontShiny?: string
  spriteBackShiny?: string
}

export interface PokemonListResponse {
  pokemon: PokemonListItem[]
  total: number
  page: number
}
