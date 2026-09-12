/**
 * Static data for all 8 Kanto Gym Leaders.
 * Each leader has Normal, Hard, and Challenge difficulty teams.
 * Moves are Gen III (FireRed/LeafGreen) compatible.
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface GymPokemonData {
  /** National Pokédex number */
  pokemonId: number
  name: string
  level: number
  /** Up to 4 Gen III level-up or TM moves */
  moves: string[]
}

export interface GymTeam {
  pokemon: GymPokemonData[]
}

export interface GymLeaderData {
  id: number
  name: string
  region: 'kanto'
  city: string
  typeName: string
  badge: string
  difficulty: {
    normal: GymTeam
    hard: GymTeam
    challenge: GymTeam
  }
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function p(pokemonId: number, name: string, level: number, moves: string[]): GymPokemonData {
  return { pokemonId, name, level, moves }
}

// ─── Gym Leaders Data ────────────────────────────────────────────────────────

export const gymLeaders: GymLeaderData[] = [
  // ── 1. Brock ────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Brock',
    region: 'kanto',
    city: 'Pewter City',
    typeName: 'Rock',
    badge: 'Boulder Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(74, 'Geodude', 12, ['Rock Throw', 'Magnitude', 'Defense Curl', 'Tackle']),
          p(95, 'Onix', 14, ['Tackle', 'Rock Throw', 'Harden', 'Bind']),
        ],
      },
      hard: {
        pokemon: [
          p(74, 'Geodude', 14, ['Rock Throw', 'Magnitude', 'Defense Curl', 'Rollout']),
          p(111, 'Rhyhorn', 15, ['Horn Attack', 'Stomp', 'Tail Whip', 'Fury Attack']),
          p(95, 'Onix', 16, ['Rock Throw', 'Harden', 'Bind', 'Rock Tomb']),
        ],
      },
      challenge: {
        pokemon: [
          p(141, 'Kabutops', 22, ['Slash', 'Absorb', 'Leer', 'Rock Tomb']),
          p(139, 'Omastar', 22, ['Water Gun', 'Constrict', 'Withdraw', 'Bite']),
          p(76, 'Golem', 24, ['Rock Blast', 'Magnitude', 'Rollout', 'Selfdestruct']),
        ],
      },
    },
  },

  // ── 2. Misty ────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Misty',
    region: 'kanto',
    city: 'Cerulean City',
    typeName: 'Water',
    badge: 'Cascade Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(120, 'Staryu', 18, ['Water Gun', 'Rapid Spin', 'Harden', 'Tackle']),
          p(121, 'Starmie', 21, ['Water Gun', 'BubbleBeam', 'Rapid Spin', 'Recover']),
        ],
      },
      hard: {
        pokemon: [
          p(116, 'Horsea', 19, ['Bubble', 'Smokescreen', 'Leer', 'Water Gun']),
          p(120, 'Staryu', 21, ['Water Gun', 'BubbleBeam', 'Rapid Spin', 'Harden']),
          p(121, 'Starmie', 23, ['Water Gun', 'BubbleBeam', 'Rapid Spin', 'Recover']),
        ],
      },
      challenge: {
        pokemon: [
          p(131, 'Lapras', 28, ['Water Gun', 'Body Slam', 'Ice Beam', 'Confuse Ray']),
          p(134, 'Vaporeon', 28, ['Water Gun', 'BubbleBeam', 'Quick Attack', 'Bite']),
          p(121, 'Starmie', 30, ['Surf', 'BubbleBeam', 'Rapid Spin', 'Psychic']),
        ],
      },
    },
  },

  // ── 3. Lt. Surge ────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Lt. Surge',
    region: 'kanto',
    city: 'Vermilion City',
    typeName: 'Electric',
    badge: 'Thunder Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(100, 'Voltorb', 21, ['Tackle', 'Screech', 'SonicBoom', 'Spark']),
          p(25, 'Pikachu', 18, ['ThunderShock', 'Quick Attack', 'Thunder Wave', 'Growl']),
          p(26, 'Raichu', 24, ['ThunderShock', 'Slam', 'Thunder Wave', 'Quick Attack']),
        ],
      },
      hard: {
        pokemon: [
          p(25, 'Pikachu', 22, ['ThunderShock', 'Quick Attack', 'Thunder Wave', 'Slam']),
          p(26, 'Raichu', 26, ['Thunderbolt', 'Slam', 'Thunder Wave', 'Quick Attack']),
          p(125, 'Electabuzz', 28, ['ThunderPunch', 'Quick Attack', 'Screech', 'Thunder Wave']),
        ],
      },
      challenge: {
        pokemon: [
          p(135, 'Jolteon', 32, ['ThunderShock', 'Thunder Wave', 'Pin Missile', 'Quick Attack']),
          p(26, 'Raichu', 33, ['Thunderbolt', 'Slam', 'Thunder Wave', 'Quick Attack']),
          p(125, 'Electabuzz', 34, ['ThunderPunch', 'Thunder', 'Screech', 'Thunder Wave']),
        ],
      },
    },
  },

  // ── 4. Erika ────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Erika',
    region: 'kanto',
    city: 'Celadon City',
    typeName: 'Grass',
    badge: 'Rainbow Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(71, 'Victreebel', 29, ['Razor Leaf', 'Sleep Powder', 'Wrap', 'PoisonPowder']),
          p(114, 'Tangela', 24, ['Vine Whip', 'Absorb', 'Constrict', 'Stun Spore']),
          p(45, 'Vileplume', 29, ['PetalDance', 'Sleep Powder', 'PoisonPowder', 'Absorb']),
        ],
      },
      hard: {
        pokemon: [
          p(189, 'Jumpluff', 28, ['Mega Drain', 'Leech Seed', 'Synthesis', 'Absorb']),
          p(71, 'Victreebel', 30, ['Razor Leaf', 'Sleep Powder', 'Wrap', 'PoisonPowder']),
          p(45, 'Vileplume', 31, ['PetalDance', 'Sleep Powder', 'PoisonPowder', 'Moonlight']),
        ],
      },
      challenge: {
        pokemon: [
          p(103, 'Exeggutor', 35, ['Egg Bomb', 'Hypnosis', 'Stomp', 'Confusion']),
          p(3, 'Venusaur', 36, ['Razor Leaf', 'Leech Seed', 'Vine Whip', 'Sleep Powder']),
          p(71, 'Victreebel', 37, ['Razor Leaf', 'Sleep Powder', 'Acid', 'Stockpile']),
        ],
      },
    },
  },

  // ── 5. Koga ─────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Koga',
    region: 'kanto',
    city: 'Fuchsia City',
    typeName: 'Poison',
    badge: 'Soul Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(109, 'Koffing', 37, ['Smog', 'Smokescreen', 'Sludge', 'Selfdestruct']),
          p(89, 'Muk', 39, ['Sludge', 'Minimize', 'Screech', 'Harden']),
          p(109, 'Koffing', 37, ['Smog', 'Smokescreen', 'Sludge', 'Toxic']),
          p(110, 'Weezing', 43, ['Smog', 'Sludge', 'Explosion', 'Smokescreen']),
        ],
      },
      hard: {
        pokemon: [
          p(49, 'Venomoth', 40, ['Psybeam', 'PoisonPowder', 'Leech Life', 'Disable']),
          p(110, 'Weezing', 43, ['Smog', 'Sludge', 'Explosion', 'Smokescreen']),
          p(89, 'Muk', 44, ['Sludge', 'Minimize', 'Screech', 'Acid Armor']),
          p(24, 'Arbok', 44, ['Bite', 'Glare', 'Poison Fang', 'Wrap']),
        ],
      },
      challenge: {
        pokemon: [
          p(169, 'Crobat', 46, ['Wing Attack', 'Bite', 'Confuse Ray', 'Toxic']),
          p(34, 'Nidoking', 47, ['Earthquake', 'Megahorn', 'Thrash', 'Sludge Bomb']),
          p(110, 'Weezing', 47, ['Sludge', 'Explosion', 'Smokescreen', 'Toxic']),
          p(49, 'Venomoth', 48, ['Psybeam', 'Toxic', 'Sleep Powder', 'Silver Wind']),
        ],
      },
    },
  },

  // ── 6. Sabrina ──────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Sabrina',
    region: 'kanto',
    city: 'Saffron City',
    typeName: 'Psychic',
    badge: 'Marsh Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(64, 'Kadabra', 38, ['Psybeam', 'Confusion', 'Recover', 'Future Sight']),
          p(122, 'Mr. Mime', 37, ['Psybeam', 'Barrier', 'Reflect', 'Confusion']),
          p(49, 'Venomoth', 38, ['Psybeam', 'Toxic', 'Sleep Powder', 'Confusion']),
          p(65, 'Alakazam', 43, ['Psychic', 'Confusion', 'Recover', 'Reflect']),
        ],
      },
      hard: {
        pokemon: [
          p(122, 'Mr. Mime', 42, ['Psychic', 'Barrier', 'Reflect', 'Confusion']),
          p(65, 'Alakazam', 45, ['Psychic', 'Confusion', 'Recover', 'Reflect']),
          p(196, 'Espeon', 46, ['Psychic', 'Psybeam', 'Confusion', 'Bite']),
        ],
      },
      challenge: {
        pokemon: [
          p(124, 'Jynx', 48, ['Psychic', 'Ice Punch', 'Confusion', 'Lovely Kiss']),
          p(65, 'Alakazam', 50, ['Psychic', 'Recover', 'Reflect', 'Shadow Ball']),
          p(196, 'Espeon', 51, ['Psychic', 'Confusion', 'Bite', 'Morning Sun']),
        ],
      },
    },
  },

  // ── 7. Blaine ───────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Blaine',
    region: 'kanto',
    city: 'Cinnabar Island',
    typeName: 'Fire',
    badge: 'Volcano Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(58, 'Growlithe', 42, ['Ember', 'Flame Wheel', 'Bite', 'Leer']),
          p(77, 'Ponyta', 40, ['Ember', 'Flame Wheel', 'Stomp', 'Growl']),
          p(78, 'Rapidash', 42, ['Ember', 'Flame Wheel', 'Stomp', 'Agility']),
          p(59, 'Arcanine', 47, ['Flamethrower', 'Extreme Speed', 'Take Down', 'Roar']),
        ],
      },
      hard: {
        pokemon: [
          p(78, 'Rapidash', 44, ['Flame Wheel', 'Stomp', 'Agility', 'Fire Blast']),
          p(126, 'Magmar', 46, ['Fire Punch', 'Ember', 'Smokescreen', 'Faint Attack']),
          p(59, 'Arcanine', 48, ['Fire Blast', 'Extreme Speed', 'Take Down', 'Flamethrower']),
        ],
      },
      challenge: {
        pokemon: [
          p(38, 'Ninetales', 50, ['Flamethrower', 'Confuse Ray', 'Quick Attack', 'Ember']),
          p(59, 'Arcanine', 52, ['Fire Blast', 'Extreme Speed', 'Take Down', 'Flamethrower']),
          p(126, 'Magmar', 52, ['Fire Blast', 'Fire Punch', 'Smokescreen', 'Faint Attack']),
        ],
      },
    },
  },

  // ── 8. Giovanni ─────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Giovanni',
    region: 'kanto',
    city: 'Viridian City',
    typeName: 'Ground',
    badge: 'Earth Badge',
    difficulty: {
      normal: {
        pokemon: [
          p(111, 'Rhyhorn', 45, ['Horn Attack', 'Stomp', 'Fury Attack', 'Tail Whip']),
          p(51, 'Dugtrio', 42, ['Slash', 'Dig', 'Sand Attack', 'Magnitude']),
          p(31, 'Nidoqueen', 44, ['Body Slam', 'Earthquake', 'Poison Sting', 'Tail Whip']),
          p(34, 'Nidoking', 45, ['Megahorn', 'Earthquake', 'Thrash', 'Poison Sting']),
          p(112, 'Rhydon', 50, ['Horn Drill', 'Earthquake', 'Stomp', 'Fury Attack']),
        ],
      },
      hard: {
        pokemon: [
          p(34, 'Nidoking', 48, ['Megahorn', 'Earthquake', 'Thrash', 'Sludge Bomb']),
          p(31, 'Nidoqueen', 48, ['Earthquake', 'Body Slam', 'Superpower', 'Sludge Bomb']),
          p(112, 'Rhydon', 50, ['Horn Drill', 'Earthquake', 'Stomp', 'Fury Attack']),
          p(76, 'Golem', 51, ['Rock Blast', 'Earthquake', 'Magnitude', 'Rollout']),
        ],
      },
      challenge: {
        pokemon: [
          p(34, 'Nidoking', 54, ['Earthquake', 'Megahorn', 'Thrash', 'Sludge Bomb']),
          p(31, 'Nidoqueen', 54, ['Earthquake', 'Superpower', 'Body Slam', 'Sludge Bomb']),
          p(112, 'Rhydon', 56, ['Earthquake', 'Horn Drill', 'Stomp', 'Fury Attack']),
          p(76, 'Golem', 56, ['Earthquake', 'Rock Blast', 'Magnitude', 'Explosion']),
        ],
      },
    },
  },
]

/** Convenience map: id → GymLeaderData */
export const gymLeadersById: ReadonlyMap<number, GymLeaderData> = new Map(
  gymLeaders.map(l => [l.id, l]),
)
