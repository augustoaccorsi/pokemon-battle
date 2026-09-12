export interface GymPokemonData {
  pokemonId: number
  name: string
  level: number
  moves: string[]
}

export interface GymTeam {
  pokemon: GymPokemonData[]
}

export interface GymLeaderData {
  id: number
  name: string
  region: 'kanto' | 'johto' | 'hoenn'
  city: string
  typeName: string
  badge: string
  difficulty: {
    normal: GymTeam
    hard: GymTeam
    challenge: GymTeam
  }
}

function p(pokemonId: number, name: string, level: number, moves: string[]): GymPokemonData {
  return { pokemonId, name, level, moves }
}

export const gymLeaders: GymLeaderData[] = [

  // ════════════════════════════════════════════════════════════
  //  KANTO
  // ════════════════════════════════════════════════════════════

  {
    id: 1, name: 'Brock', region: 'kanto', city: 'Pewter City',
    typeName: 'Rock', badge: 'Boulder Badge',
    difficulty: {
      normal: { pokemon: [
        p(74, 'Geodude', 12, ['Rock Throw', 'Magnitude', 'Defense Curl', 'Tackle']),
        p(95, 'Onix',    14, ['Tackle', 'Rock Throw', 'Harden', 'Bind']),
      ]},
      hard: { pokemon: [
        p(74,  'Geodude', 14, ['Rock Throw', 'Magnitude', 'Defense Curl', 'Rollout']),
        p(111, 'Rhyhorn', 15, ['Horn Attack', 'Stomp', 'Tail Whip', 'Fury Attack']),
        p(95,  'Onix',    16, ['Rock Throw', 'Harden', 'Bind', 'Rock Tomb']),
      ]},
      challenge: { pokemon: [
        p(141, 'Kabutops', 22, ['Slash', 'Absorb', 'Leer', 'Rock Tomb']),
        p(139, 'Omastar',  22, ['Water Gun', 'Constrict', 'Withdraw', 'Bite']),
        p(76,  'Golem',    24, ['Rock Blast', 'Magnitude', 'Rollout', 'Selfdestruct']),
      ]},
    },
  },

  {
    id: 2, name: 'Misty', region: 'kanto', city: 'Cerulean City',
    typeName: 'Water', badge: 'Cascade Badge',
    difficulty: {
      normal: { pokemon: [
        p(120, 'Staryu',  18, ['Water Gun', 'Rapid Spin', 'Harden', 'Tackle']),
        p(121, 'Starmie', 21, ['Water Gun', 'BubbleBeam', 'Rapid Spin', 'Recover']),
      ]},
      hard: { pokemon: [
        p(116, 'Horsea',  19, ['Bubble', 'Smokescreen', 'Leer', 'Water Gun']),
        p(120, 'Staryu',  21, ['Water Gun', 'BubbleBeam', 'Rapid Spin', 'Harden']),
        p(121, 'Starmie', 23, ['Water Gun', 'BubbleBeam', 'Rapid Spin', 'Recover']),
      ]},
      challenge: { pokemon: [
        p(131, 'Lapras',  28, ['Water Gun', 'Body Slam', 'Ice Beam', 'Confuse Ray']),
        p(134, 'Vaporeon',28, ['Water Gun', 'BubbleBeam', 'Quick Attack', 'Bite']),
        p(121, 'Starmie', 30, ['Surf', 'BubbleBeam', 'Rapid Spin', 'Psychic']),
      ]},
    },
  },

  {
    id: 3, name: 'Lt. Surge', region: 'kanto', city: 'Vermilion City',
    typeName: 'Electric', badge: 'Thunder Badge',
    difficulty: {
      normal: { pokemon: [
        p(100, 'Voltorb', 21, ['Tackle', 'Screech', 'SonicBoom', 'Spark']),
        p(25,  'Pikachu', 18, ['ThunderShock', 'Quick Attack', 'Thunder Wave', 'Growl']),
        p(26,  'Raichu',  24, ['ThunderShock', 'Slam', 'Thunder Wave', 'Quick Attack']),
      ]},
      hard: { pokemon: [
        p(25,  'Pikachu',   22, ['ThunderShock', 'Quick Attack', 'Thunder Wave', 'Slam']),
        p(26,  'Raichu',    26, ['Thunderbolt', 'Slam', 'Thunder Wave', 'Quick Attack']),
        p(125, 'Electabuzz',28, ['ThunderPunch', 'Quick Attack', 'Screech', 'Thunder Wave']),
      ]},
      challenge: { pokemon: [
        p(135, 'Jolteon',   32, ['ThunderShock', 'Thunder Wave', 'Pin Missile', 'Quick Attack']),
        p(26,  'Raichu',    33, ['Thunderbolt', 'Slam', 'Thunder Wave', 'Quick Attack']),
        p(125, 'Electabuzz',34, ['ThunderPunch', 'Thunder', 'Screech', 'Thunder Wave']),
      ]},
    },
  },

  {
    id: 4, name: 'Erika', region: 'kanto', city: 'Celadon City',
    typeName: 'Grass', badge: 'Rainbow Badge',
    difficulty: {
      normal: { pokemon: [
        p(71,  'Victreebel', 29, ['Razor Leaf', 'Sleep Powder', 'Wrap', 'PoisonPowder']),
        p(114, 'Tangela',    24, ['Vine Whip', 'Absorb', 'Constrict', 'Stun Spore']),
        p(45,  'Vileplume',  29, ['PetalDance', 'Sleep Powder', 'PoisonPowder', 'Absorb']),
      ]},
      hard: { pokemon: [
        p(189, 'Jumpluff',   28, ['Mega Drain', 'Leech Seed', 'Synthesis', 'Absorb']),
        p(71,  'Victreebel', 30, ['Razor Leaf', 'Sleep Powder', 'Wrap', 'PoisonPowder']),
        p(45,  'Vileplume',  31, ['PetalDance', 'Sleep Powder', 'PoisonPowder', 'Moonlight']),
      ]},
      challenge: { pokemon: [
        p(103, 'Exeggutor',  35, ['Egg Bomb', 'Hypnosis', 'Stomp', 'Confusion']),
        p(3,   'Venusaur',   36, ['Razor Leaf', 'Leech Seed', 'Vine Whip', 'Sleep Powder']),
        p(71,  'Victreebel', 37, ['Razor Leaf', 'Sleep Powder', 'Acid', 'Stockpile']),
      ]},
    },
  },

  {
    id: 5, name: 'Koga', region: 'kanto', city: 'Fuchsia City',
    typeName: 'Poison', badge: 'Soul Badge',
    difficulty: {
      normal: { pokemon: [
        p(109, 'Koffing', 37, ['Smog', 'Smokescreen', 'Sludge', 'Selfdestruct']),
        p(89,  'Muk',     39, ['Sludge', 'Minimize', 'Screech', 'Harden']),
        p(109, 'Koffing', 37, ['Smog', 'Smokescreen', 'Sludge', 'Toxic']),
        p(110, 'Weezing', 43, ['Smog', 'Sludge', 'Explosion', 'Smokescreen']),
      ]},
      hard: { pokemon: [
        p(49,  'Venomoth', 40, ['Psybeam', 'PoisonPowder', 'Leech Life', 'Disable']),
        p(110, 'Weezing',  43, ['Smog', 'Sludge', 'Explosion', 'Smokescreen']),
        p(89,  'Muk',      44, ['Sludge', 'Minimize', 'Screech', 'Acid Armor']),
        p(24,  'Arbok',    44, ['Bite', 'Glare', 'Poison Fang', 'Wrap']),
      ]},
      challenge: { pokemon: [
        p(169, 'Crobat',   46, ['Wing Attack', 'Bite', 'Confuse Ray', 'Toxic']),
        p(34,  'Nidoking', 47, ['Earthquake', 'Megahorn', 'Thrash', 'Sludge Bomb']),
        p(110, 'Weezing',  47, ['Sludge', 'Explosion', 'Smokescreen', 'Toxic']),
        p(49,  'Venomoth', 48, ['Psybeam', 'Toxic', 'Sleep Powder', 'Silver Wind']),
      ]},
    },
  },

  {
    id: 6, name: 'Sabrina', region: 'kanto', city: 'Saffron City',
    typeName: 'Psychic', badge: 'Marsh Badge',
    difficulty: {
      normal: { pokemon: [
        p(64,  'Kadabra', 38, ['Psybeam', 'Confusion', 'Recover', 'Future Sight']),
        p(122, 'Mr. Mime',37, ['Psybeam', 'Barrier', 'Reflect', 'Confusion']),
        p(49,  'Venomoth',38, ['Psybeam', 'Toxic', 'Sleep Powder', 'Confusion']),
        p(65,  'Alakazam',43, ['Psychic', 'Confusion', 'Recover', 'Reflect']),
      ]},
      hard: { pokemon: [
        p(122, 'Mr. Mime', 42, ['Psychic', 'Barrier', 'Reflect', 'Confusion']),
        p(65,  'Alakazam', 45, ['Psychic', 'Confusion', 'Recover', 'Reflect']),
        p(196, 'Espeon',   46, ['Psychic', 'Psybeam', 'Confusion', 'Bite']),
      ]},
      challenge: { pokemon: [
        p(124, 'Jynx',    48, ['Psychic', 'Ice Punch', 'Confusion', 'Lovely Kiss']),
        p(65,  'Alakazam',50, ['Psychic', 'Recover', 'Reflect', 'Shadow Ball']),
        p(196, 'Espeon',  51, ['Psychic', 'Confusion', 'Bite', 'Morning Sun']),
      ]},
    },
  },

  {
    id: 7, name: 'Blaine', region: 'kanto', city: 'Cinnabar Island',
    typeName: 'Fire', badge: 'Volcano Badge',
    difficulty: {
      normal: { pokemon: [
        p(58,  'Growlithe', 42, ['Ember', 'Flame Wheel', 'Bite', 'Leer']),
        p(77,  'Ponyta',    40, ['Ember', 'Flame Wheel', 'Stomp', 'Growl']),
        p(78,  'Rapidash',  42, ['Ember', 'Flame Wheel', 'Stomp', 'Agility']),
        p(59,  'Arcanine',  47, ['Flamethrower', 'Extreme Speed', 'Take Down', 'Roar']),
      ]},
      hard: { pokemon: [
        p(78,  'Rapidash',  44, ['Flame Wheel', 'Stomp', 'Agility', 'Fire Blast']),
        p(126, 'Magmar',    46, ['Fire Punch', 'Ember', 'Smokescreen', 'Faint Attack']),
        p(59,  'Arcanine',  48, ['Fire Blast', 'Extreme Speed', 'Take Down', 'Flamethrower']),
      ]},
      challenge: { pokemon: [
        p(38,  'Ninetales', 50, ['Flamethrower', 'Confuse Ray', 'Quick Attack', 'Ember']),
        p(59,  'Arcanine',  52, ['Fire Blast', 'Extreme Speed', 'Take Down', 'Flamethrower']),
        p(126, 'Magmar',    52, ['Fire Blast', 'Fire Punch', 'Smokescreen', 'Faint Attack']),
      ]},
    },
  },

  {
    id: 8, name: 'Giovanni', region: 'kanto', city: 'Viridian City',
    typeName: 'Ground', badge: 'Earth Badge',
    difficulty: {
      normal: { pokemon: [
        p(111, 'Rhyhorn',  45, ['Horn Attack', 'Stomp', 'Fury Attack', 'Tail Whip']),
        p(51,  'Dugtrio',  42, ['Slash', 'Dig', 'Sand Attack', 'Magnitude']),
        p(31,  'Nidoqueen',44, ['Body Slam', 'Earthquake', 'Poison Sting', 'Tail Whip']),
        p(34,  'Nidoking', 45, ['Megahorn', 'Earthquake', 'Thrash', 'Poison Sting']),
        p(112, 'Rhydon',   50, ['Horn Drill', 'Earthquake', 'Stomp', 'Fury Attack']),
      ]},
      hard: { pokemon: [
        p(34,  'Nidoking', 48, ['Megahorn', 'Earthquake', 'Thrash', 'Sludge Bomb']),
        p(31,  'Nidoqueen',48, ['Earthquake', 'Body Slam', 'Superpower', 'Sludge Bomb']),
        p(112, 'Rhydon',   50, ['Horn Drill', 'Earthquake', 'Stomp', 'Fury Attack']),
        p(76,  'Golem',    51, ['Rock Blast', 'Earthquake', 'Magnitude', 'Rollout']),
      ]},
      challenge: { pokemon: [
        p(34,  'Nidoking', 54, ['Earthquake', 'Megahorn', 'Thrash', 'Sludge Bomb']),
        p(31,  'Nidoqueen',54, ['Earthquake', 'Superpower', 'Body Slam', 'Sludge Bomb']),
        p(112, 'Rhydon',   56, ['Earthquake', 'Horn Drill', 'Stomp', 'Fury Attack']),
        p(76,  'Golem',    56, ['Earthquake', 'Rock Blast', 'Magnitude', 'Explosion']),
      ]},
    },
  },

  // ════════════════════════════════════════════════════════════
  //  JOHTO
  // ════════════════════════════════════════════════════════════

  {
    id: 9, name: 'Falkner', region: 'johto', city: 'Violet City',
    typeName: 'Flying', badge: 'Zephyr Badge',
    difficulty: {
      normal: { pokemon: [
        p(16, 'Pidgey',    9,  ['Tackle', 'Gust', 'Sand Attack', 'Quick Attack']),
        p(17, 'Pidgeotto', 13, ['Gust', 'Quick Attack', 'Whirlwind', 'Wing Attack']),
      ]},
      hard: { pokemon: [
        p(17, 'Pidgeotto', 15, ['Gust', 'Wing Attack', 'Quick Attack', 'Whirlwind']),
        p(18, 'Pidgeot',   17, ['Wing Attack', 'Quick Attack', 'Gust', 'Agility']),
      ]},
      challenge: { pokemon: [
        p(18,  'Pidgeot',  20, ['Wing Attack', 'Quick Attack', 'Agility', 'Aerial Ace']),
        p(142, 'Aerodactyl',20,['Wing Attack', 'Bite', 'Scary Face', 'Ancient Power']),
      ]},
    },
  },

  {
    id: 10, name: 'Bugsy', region: 'johto', city: 'Azalea Town',
    typeName: 'Bug', badge: 'Hive Badge',
    difficulty: {
      normal: { pokemon: [
        p(11,  'Metapod', 14, ['Harden', 'Tackle', 'String Shot', 'Bug Bite']),
        p(14,  'Kakuna',  14, ['Harden', 'Poison Sting', 'String Shot', 'Bug Bite']),
        p(123, 'Scyther', 16, ['Quick Attack', 'Fury Cutter', 'Wing Attack', 'Slash']),
      ]},
      hard: { pokemon: [
        p(123, 'Scyther',   17, ['Fury Cutter', 'Wing Attack', 'Slash', 'Agility']),
        p(214, 'Heracross', 18, ['Horn Attack', 'Endure', 'Seismic Toss', 'Bullet Seed']),
      ]},
      challenge: { pokemon: [
        p(212, 'Scizor',    22, ['Bullet Punch', 'Slash', 'Agility', 'Swords Dance']),
        p(214, 'Heracross', 22, ['Megahorn', 'Brick Break', 'Endure', 'Counter']),
      ]},
    },
  },

  {
    id: 11, name: 'Whitney', region: 'johto', city: 'Goldenrod City',
    typeName: 'Normal', badge: 'Plain Badge',
    difficulty: {
      normal: { pokemon: [
        p(35,  'Clefairy', 17, ['Pound', 'Growl', 'Sing', 'Doubleslap']),
        p(241, 'Miltank',  19, ['Stomp', 'Body Slam', 'Attract', 'Rollout']),
      ]},
      hard: { pokemon: [
        p(241, 'Miltank',  20, ['Body Slam', 'Rollout', 'Milk Drink', 'Attract']),
        p(36,  'Clefable', 21, ['Pound', 'Metronome', 'Doubleslap', 'Minimize']),
      ]},
      challenge: { pokemon: [
        p(241, 'Miltank',  26, ['Body Slam', 'Rollout', 'Milk Drink', 'Heal Bell']),
        p(113, 'Chansey',  26, ['Soft-Boiled', 'Doubleslap', 'Minimize', 'Sing']),
      ]},
    },
  },

  {
    id: 12, name: 'Morty', region: 'johto', city: 'Ecruteak City',
    typeName: 'Ghost', badge: 'Fog Badge',
    difficulty: {
      normal: { pokemon: [
        p(92, 'Gastly',  21, ['Hypnosis', 'Lick', 'Night Shade', 'Spite']),
        p(93, 'Haunter', 21, ['Hypnosis', 'Lick', 'Night Shade', 'Spite']),
        p(93, 'Haunter', 23, ['Hypnosis', 'Shadow Ball', 'Night Shade', 'Confuse Ray']),
        p(94, 'Gengar',  25, ['Hypnosis', 'Shadow Ball', 'Sludge Bomb', 'Destiny Bond']),
      ]},
      hard: { pokemon: [
        p(93, 'Haunter', 26, ['Shadow Ball', 'Hypnosis', 'Confuse Ray', 'Night Shade']),
        p(94, 'Gengar',  28, ['Shadow Ball', 'Hypnosis', 'Sludge Bomb', 'Destiny Bond']),
        p(200,'Misdreavus',27,['Shadow Ball', 'Psybeam', 'Confuse Ray', 'Mean Look']),
      ]},
      challenge: { pokemon: [
        p(94,  'Gengar',    32, ['Shadow Ball', 'Sludge Bomb', 'Hypnosis', 'Destiny Bond']),
        p(200, 'Misdreavus',31, ['Shadow Ball', 'Confuse Ray', 'Mean Look', 'Perish Song']),
      ]},
    },
  },

  {
    id: 13, name: 'Chuck', region: 'johto', city: 'Cianwood City',
    typeName: 'Fighting', badge: 'Storm Badge',
    difficulty: {
      normal: { pokemon: [
        p(57, 'Primeape',  27, ['Low Kick', 'Karate Chop', 'Seismic Toss', 'Cross Chop']),
        p(62, 'Poliwrath', 30, ['Surf', 'Body Slam', 'Hypnosis', 'Submission']),
      ]},
      hard: { pokemon: [
        p(57,  'Primeape',  29, ['Cross Chop', 'Seismic Toss', 'Karate Chop', 'Rock Slide']),
        p(62,  'Poliwrath', 32, ['Submission', 'Surf', 'Hypnosis', 'Body Slam']),
        p(107, 'Hitmonchan',31, ['Fire Punch', 'Ice Punch', 'ThunderPunch', 'Mach Punch']),
      ]},
      challenge: { pokemon: [
        p(62,  'Poliwrath',  36, ['Submission', 'Body Slam', 'Hypnosis', 'Mind Reader']),
        p(107, 'Hitmonchan', 35, ['Fire Punch', 'Ice Punch', 'ThunderPunch', 'Sky Uppercut']),
        p(297, 'Hariyama',   35, ['Brick Break', 'Arm Thrust', 'Bulk Up', 'Vital Throw']),
      ]},
    },
  },

  {
    id: 14, name: 'Jasmine', region: 'johto', city: 'Olivine City',
    typeName: 'Steel', badge: 'Mineral Badge',
    difficulty: {
      normal: { pokemon: [
        p(81,  'Magnemite', 30, ['Thundershock', 'Sonicboom', 'Thunder Wave', 'Spark']),
        p(81,  'Magnemite', 30, ['Thundershock', 'Sonicboom', 'Thunder Wave', 'Spark']),
        p(208, 'Steelix',   35, ['Iron Tail', 'Earthquake', 'Sandstorm', 'Rock Throw']),
      ]},
      hard: { pokemon: [
        p(82,  'Magneton',  33, ['Thunderbolt', 'Thunder Wave', 'Spark', 'Supersonic']),
        p(208, 'Steelix',   36, ['Iron Tail', 'Earthquake', 'Rock Tomb', 'Screech']),
        p(227, 'Skarmory',  34, ['Steel Wing', 'Aerial Ace', 'Fury Attack', 'Sand Attack']),
      ]},
      challenge: { pokemon: [
        p(208, 'Steelix',   40, ['Iron Tail', 'Earthquake', 'Crunch', 'Rock Tomb']),
        p(227, 'Skarmory',  40, ['Steel Wing', 'Aerial Ace', 'Spikes', 'Protect']),
        p(376, 'Metagross',  38, ['Meteor Mash', 'Psychic', 'Earthquake', 'Agility']),
      ]},
    },
  },

  {
    id: 15, name: 'Pryce', region: 'johto', city: 'Mahogany Town',
    typeName: 'Ice', badge: 'Glacier Badge',
    difficulty: {
      normal: { pokemon: [
        p(86,  'Seel',     27, ['Headbutt', 'Aurora Beam', 'Rest', 'Icy Wind']),
        p(87,  'Dewgong',  29, ['Ice Beam', 'Headbutt', 'Rest', 'Aurora Beam']),
        p(221, 'Piloswine',31, ['Blizzard', 'Earthquake', 'Amnesia', 'Mud Slap']),
      ]},
      hard: { pokemon: [
        p(87,  'Dewgong',   31, ['Ice Beam', 'Surf', 'Rest', 'Aurora Beam']),
        p(221, 'Piloswine', 33, ['Blizzard', 'Earthquake', 'Amnesia', 'Mud Slap']),
        p(91,  'Cloyster',  32, ['Surf', 'Ice Beam', 'Clamp', 'Spike Cannon']),
      ]},
      challenge: { pokemon: [
        p(131, 'Lapras',    38, ['Blizzard', 'Surf', 'Body Slam', 'Confuse Ray']),
        p(221, 'Piloswine', 38, ['Blizzard', 'Earthquake', 'Mud Slap', 'Amnesia']),
        p(144, 'Articuno',  40, ['Blizzard', 'Ice Beam', 'Agility', 'Mind Reader']),
      ]},
    },
  },

  {
    id: 16, name: 'Clair', region: 'johto', city: 'Blackthorn City',
    typeName: 'Dragon', badge: 'Rising Badge',
    difficulty: {
      normal: { pokemon: [
        p(148, 'Dragonair', 37, ['Dragon Rage', 'Slam', 'Hyper Beam', 'Thunder Wave']),
        p(148, 'Dragonair', 37, ['Dragon Rage', 'Slam', 'Hyper Beam', 'Thunder Wave']),
        p(148, 'Dragonair', 37, ['Dragon Rage', 'Slam', 'Leer', 'Wrap']),
        p(230, 'Kingdra',   40, ['Surf', 'Dragonbreath', 'Smokescreen', 'Hyper Beam']),
      ]},
      hard: { pokemon: [
        p(148, 'Dragonair', 40, ['Dragonbreath', 'Slam', 'Hyper Beam', 'Thunder Wave']),
        p(149, 'Dragonite', 41, ['Dragonbreath', 'Slam', 'Thunder Wave', 'Wing Attack']),
        p(230, 'Kingdra',   44, ['Surf', 'Dragonbreath', 'Dragon Dance', 'Hyper Beam']),
      ]},
      challenge: { pokemon: [
        p(149, 'Dragonite', 48, ['Outrage', 'Fire Blast', 'Thunder', 'Extreme Speed']),
        p(230, 'Kingdra',   50, ['Surf', 'Dragonbreath', 'Dragon Dance', 'Hyper Beam']),
        p(373, 'Salamence', 50, ['Dragonbreath', 'Flamethrower', 'Crunch', 'Dragon Dance']),
      ]},
    },
  },

  // ════════════════════════════════════════════════════════════
  //  HOENN
  // ════════════════════════════════════════════════════════════

  {
    id: 17, name: 'Roxanne', region: 'hoenn', city: 'Rustboro City',
    typeName: 'Rock', badge: 'Stone Badge',
    difficulty: {
      normal: { pokemon: [
        p(74,  'Geodude', 12, ['Tackle', 'Defense Curl', 'Rock Throw', 'Magnitude']),
        p(74,  'Geodude', 12, ['Tackle', 'Defense Curl', 'Rock Throw', 'Magnitude']),
        p(299, 'Nosepass',15, ['Tackle', 'Harden', 'Block', 'Rock Throw']),
      ]},
      hard: { pokemon: [
        p(75,  'Graveler', 16, ['Rock Throw', 'Magnitude', 'Defense Curl', 'Rock Tomb']),
        p(299, 'Nosepass', 17, ['Rock Throw', 'Harden', 'Thunder Wave', 'Rock Tomb']),
        p(95,  'Onix',     18, ['Rock Throw', 'Harden', 'Bind', 'Screech']),
      ]},
      challenge: { pokemon: [
        p(76,  'Golem',   22, ['Rock Blast', 'Earthquake', 'Magnitude', 'Rollout']),
        p(299, 'Nosepass',22, ['Rock Slide', 'Thunder Wave', 'Protect', 'Harden']),
        p(185, 'Sudowoodo',23,['Rock Slide', 'Low Kick', 'Mimic', 'Flail']),
      ]},
    },
  },

  {
    id: 18, name: 'Brawly', region: 'hoenn', city: 'Dewford Town',
    typeName: 'Fighting', badge: 'Knuckle Badge',
    difficulty: {
      normal: { pokemon: [
        p(66,  'Machop',   17, ['Low Kick', 'Karate Chop', 'Seismic Toss', 'Focus Energy']),
        p(307, 'Meditite', 17, ['Meditate', 'Confusion', 'Detect', 'Force Palm']),
        p(296, 'Makuhita', 19, ['Arm Thrust', 'Bulk Up', 'Vital Throw', 'Seismic Toss']),
      ]},
      hard: { pokemon: [
        p(67,  'Machoke',  21, ['Karate Chop', 'Seismic Toss', 'Cross Chop', 'Rock Slide']),
        p(308, 'Medicham', 22, ['Hi Jump Kick', 'Confusion', 'Detect', 'Bulk Up']),
        p(297, 'Hariyama', 22, ['Brick Break', 'Arm Thrust', 'Bulk Up', 'Vital Throw']),
      ]},
      challenge: { pokemon: [
        p(106, 'Hitmonlee', 27, ['Hi Jump Kick', 'Rolling Kick', 'Mega Kick', 'Endure']),
        p(308, 'Medicham',  27, ['Hi Jump Kick', 'Confusion', 'Bulk Up', 'Calm Mind']),
        p(297, 'Hariyama',  28, ['Brick Break', 'Bulk Up', 'Knock Off', 'Arm Thrust']),
      ]},
    },
  },

  {
    id: 19, name: 'Wattson', region: 'hoenn', city: 'Mauville City',
    typeName: 'Electric', badge: 'Dynamo Badge',
    difficulty: {
      normal: { pokemon: [
        p(100, 'Voltorb',  20, ['Tackle', 'Screech', 'Sonicboom', 'Spark']),
        p(309, 'Electrike',20, ['Tackle', 'Thunder Wave', 'Quick Attack', 'Spark']),
        p(82,  'Magneton', 22, ['Thunderbolt', 'Thunder Wave', 'Spark', 'Supersonic']),
        p(310, 'Manectric',24, ['Thunderbolt', 'Thunder Wave', 'Quick Attack', 'Howl']),
      ]},
      hard: { pokemon: [
        p(82,  'Magneton',  25, ['Thunderbolt', 'Thunder Wave', 'Spark', 'Supersonic']),
        p(310, 'Manectric', 26, ['Thunderbolt', 'Thunder Wave', 'Quick Attack', 'Charge']),
        p(101, 'Electrode', 26, ['Thunderbolt', 'Screech', 'Sonicboom', 'Explosion']),
      ]},
      challenge: { pokemon: [
        p(310, 'Manectric', 32, ['Thunderbolt', 'Crunch', 'Quick Attack', 'Charge']),
        p(101, 'Electrode', 31, ['Thunder', 'Screech', 'Explosion', 'Sonicboom']),
        p(135, 'Jolteon',   33, ['Thunderbolt', 'Thunder Wave', 'Pin Missile', 'Quick Attack']),
      ]},
    },
  },

  {
    id: 20, name: 'Flannery', region: 'hoenn', city: 'Lavaridge Town',
    typeName: 'Fire', badge: 'Heat Badge',
    difficulty: {
      normal: { pokemon: [
        p(218, 'Slugma',  26, ['Ember', 'Smog', 'Rock Throw', 'Amnesia']),
        p(218, 'Slugma',  26, ['Ember', 'Smog', 'Rock Throw', 'Amnesia']),
        p(324, 'Torkoal', 28, ['Ember', 'Flamethrower', 'Body Slam', 'Protect']),
      ]},
      hard: { pokemon: [
        p(219, 'Magcargo',  29, ['Flamethrower', 'Rock Slide', 'Body Slam', 'Amnesia']),
        p(324, 'Torkoal',   30, ['Flamethrower', 'Body Slam', 'Protect', 'Overheat']),
        p(59,  'Arcanine',  30, ['Flamethrower', 'Extreme Speed', 'Crunch', 'Bite']),
      ]},
      challenge: { pokemon: [
        p(324, 'Torkoal',   35, ['Overheat', 'Body Slam', 'Protect', 'Amnesia']),
        p(126, 'Magmar',    35, ['Fire Blast', 'Fire Punch', 'Smokescreen', 'Faint Attack']),
        p(38,  'Ninetales', 36, ['Flamethrower', 'Confuse Ray', 'Quick Attack', 'Fire Spin']),
      ]},
    },
  },

  {
    id: 21, name: 'Norman', region: 'hoenn', city: 'Petalburg City',
    typeName: 'Normal', badge: 'Balance Badge',
    difficulty: {
      normal: { pokemon: [
        p(327, 'Spinda',   27, ['Tackle', 'Psybeam', 'Dizzy Punch', 'Teeter Dance']),
        p(288, 'Vigoroth', 27, ['Slash', 'Encore', 'Focus Energy', 'Vital Throw']),
        p(264, 'Linoone',  29, ['Headbutt', 'Tail Whip', 'Slash', 'Sand Attack']),
        p(289, 'Slaking',  31, ['Hyper Beam', 'Earthquake', 'Yawn', 'Slack Off']),
      ]},
      hard: { pokemon: [
        p(288, 'Vigoroth', 30, ['Slash', 'Bulk Up', 'Fury Swipes', 'Endure']),
        p(264, 'Linoone',  31, ['Headbutt', 'Slash', 'Belly Drum', 'Extreme Speed']),
        p(289, 'Slaking',  34, ['Hyper Beam', 'Earthquake', 'Shadow Ball', 'Yawn']),
      ]},
      challenge: { pokemon: [
        p(289, 'Slaking',  38, ['Hyper Beam', 'Earthquake', 'Shadow Ball', 'Swagger']),
        p(289, 'Slaking',  38, ['Hyper Beam', 'Earthquake', 'Brick Break', 'Yawn']),
        p(143, 'Snorlax',  40, ['Body Slam', 'Hyper Beam', 'Earthquake', 'Rest']),
      ]},
    },
  },

  {
    id: 22, name: 'Winona', region: 'hoenn', city: 'Fortree City',
    typeName: 'Flying', badge: 'Feather Badge',
    difficulty: {
      normal: { pokemon: [
        p(277, 'Swellow',  31, ['Wing Attack', 'Double Team', 'Quick Attack', 'Aerial Ace']),
        p(279, 'Pelipper', 30, ['Surf', 'Wing Attack', 'Water Gun', 'Gust']),
        p(227, 'Skarmory', 32, ['Steel Wing', 'Aerial Ace', 'Sand Attack', 'Protect']),
        p(334, 'Altaria',  33, ['Dragonbreath', 'Take Down', 'Sing', 'Aerial Ace']),
      ]},
      hard: { pokemon: [
        p(227, 'Skarmory', 34, ['Steel Wing', 'Aerial Ace', 'Spikes', 'Protect']),
        p(334, 'Altaria',  35, ['Dragonbreath', 'Aerial Ace', 'Dragon Dance', 'Sing']),
        p(277, 'Swellow',  35, ['Aerial Ace', 'Double Team', 'Quick Attack', 'Endeavor']),
      ]},
      challenge: { pokemon: [
        p(334, 'Altaria',  40, ['Dragon Dance', 'Dragonbreath', 'Aerial Ace', 'Sing']),
        p(227, 'Skarmory', 40, ['Steel Wing', 'Aerial Ace', 'Spikes', 'Protect']),
        p(142, 'Aerodactyl',41,['Wing Attack', 'Bite', 'Aerial Ace', 'Ancient Power']),
      ]},
    },
  },

  {
    id: 23, name: 'Tate & Liza', region: 'hoenn', city: 'Mossdeep City',
    typeName: 'Psychic', badge: 'Mind Badge',
    difficulty: {
      normal: { pokemon: [
        p(338, 'Solrock',  42, ['Psywave', 'Rock Slide', 'Flamethrower', 'Confusion']),
        p(337, 'Lunatone', 42, ['Psywave', 'Confusion', 'Ice Beam', 'Hypnosis']),
      ]},
      hard: { pokemon: [
        p(338, 'Solrock',  44, ['Psywave', 'Rock Slide', 'Flamethrower', 'Cosmic Power']),
        p(337, 'Lunatone', 44, ['Psychic', 'Ice Beam', 'Hypnosis', 'Cosmic Power']),
        p(196, 'Espeon',   43, ['Psychic', 'Psybeam', 'Confusion', 'Morning Sun']),
      ]},
      challenge: { pokemon: [
        p(338, 'Solrock',  50, ['Psychic', 'Rock Slide', 'Flamethrower', 'Cosmic Power']),
        p(337, 'Lunatone', 50, ['Psychic', 'Ice Beam', 'Hypnosis', 'Cosmic Power']),
        p(282, 'Gardevoir',49, ['Psychic', 'Calm Mind', 'Magical Leaf', 'Future Sight']),
      ]},
    },
  },

  {
    id: 24, name: 'Juan', region: 'hoenn', city: 'Sootopolis City',
    typeName: 'Water', badge: 'Rain Badge',
    difficulty: {
      normal: { pokemon: [
        p(370, 'Luvdisc',   41, ['Water Gun', 'Attract', 'Sweet Kiss', 'Agility']),
        p(340, 'Whiscash',  41, ['Surf', 'Earthquake', 'Amnesia', 'Tickle']),
        p(364, 'Sealeo',    43, ['Ice Ball', 'Body Slam', 'Aurora Beam', 'Encore']),
        p(342, 'Crawdaunt', 43, ['Bubble Beam', 'Taunt', 'Swords Dance', 'Crabhammer']),
        p(230, 'Kingdra',   46, ['Surf', 'Dragonbreath', 'Smokescreen', 'Hyper Beam']),
      ]},
      hard: { pokemon: [
        p(340, 'Whiscash',  44, ['Surf', 'Earthquake', 'Amnesia', 'Ice Beam']),
        p(342, 'Crawdaunt', 45, ['Crabhammer', 'Bubble Beam', 'Swords Dance', 'Taunt']),
        p(230, 'Kingdra',   48, ['Surf', 'Dragon Dance', 'Dragonbreath', 'Hyper Beam']),
        p(131, 'Lapras',    46, ['Surf', 'Ice Beam', 'Body Slam', 'Confuse Ray']),
      ]},
      challenge: { pokemon: [
        p(230, 'Kingdra',   54, ['Surf', 'Dragon Dance', 'Dragonbreath', 'Hyper Beam']),
        p(342, 'Crawdaunt', 52, ['Crabhammer', 'Swords Dance', 'Taunt', 'Bubble Beam']),
        p(350, 'Milotic',   53, ['Surf', 'Ice Beam', 'Recover', 'Attract']),
        p(245, 'Suicune',   55, ['Surf', 'Ice Beam', 'Calm Mind', 'Aurora Beam']),
      ]},
    },
  },
]

export const gymLeadersById: ReadonlyMap<number, GymLeaderData> = new Map(
  gymLeaders.map(l => [l.id, l]),
)
