import { describe, it, expect } from 'vitest';
import { calculateDamage } from '../DamageCalculator';
import { BattleRandom } from '../Random';
import type { BattlePokemon, BattleMove } from '../BattleState';

// ---------- FixedRandom ----------
// value < 0.5  → chance() = false, nextInt biased low
// value >= 0.5 → chance() = true,  nextInt biased high
class FixedRandom extends BattleRandom {
  constructor(private value: number) {
    super(0);
  }
  override next(): number {
    return this.value;
  }
  override nextInt(min: number, max: number): number {
    return Math.floor(this.value * (max - min + 1)) + min;
  }
  override chance(_p: number): boolean {
    return this.value > 0.5;
  }
}

// ---------- factories ----------

function makePokemon(overrides: Partial<BattlePokemon> = {}): BattlePokemon {
  return {
    id: 'p1',
    name: 'TestMon',
    currentHp: 200,
    maxHp: 200,
    level: 50,
    attack: 80,
    defense: 80,
    spAttack: 80,
    spDefense: 80,
    speed: 80,
    types: ['Normal'],
    moves: [],
    status: 'none',
    isActive: true,
    ...overrides,
  };
}

function makeMove(overrides: Partial<BattleMove> = {}): BattleMove {
  return {
    id: 'tackle',
    name: 'Tackle',
    type: 'Normal',
    category: 'physical',
    power: 40,
    // accuracy undefined → always hits (in MoveResolver; calculateDamage ignores it)
    currentPP: 35,
    maxPP: 35,
    priority: 0,
    ...overrides,
  };
}

// ---------- tests ----------

describe('calculateDamage', () => {
  it('Electric move vs Ground-type Pokémon deals 0 damage (immune)', () => {
    const pikachu = makePokemon({
      name: 'Pikachu',
      types: ['Electric'],
      level: 50,
      spAttack: 65,
    });
    const geodude = makePokemon({
      name: 'Geodude',
      types: ['Rock', 'Ground'],
      spDefense: 30,
    });
    const thunderbolt = makeMove({
      type: 'Electric',
      power: 95,
      category: 'special',
    });

    const result = calculateDamage({ attacker: pikachu, move: thunderbolt, defender: geodude }, new FixedRandom(0.9));
    expect(result.effectiveness).toBe(0);
    expect(result.damage).toBe(0);
  });

  it('Electric vs Water/Psychic does significant damage (×2)', () => {
    const pikachu = makePokemon({
      name: 'Pikachu',
      types: ['Electric'],
      level: 50,
      spAttack: 65,
    });
    const starmie = makePokemon({
      name: 'Starmie',
      types: ['Water', 'Psychic'],
      spDefense: 85,
    });
    const thunderbolt = makeMove({ type: 'Electric', power: 95, category: 'special' });

    const result = calculateDamage({ attacker: pikachu, move: thunderbolt, defender: starmie }, new FixedRandom(0.9));
    expect(result.effectiveness).toBe(2);
    expect(result.damage).toBeGreaterThan(10);
  });

  it('Fire move vs Water/Fire Pokémon: combined ×0.25 effectiveness', () => {
    const attacker = makePokemon({ types: ['Normal'], spAttack: 80 });
    const defender = makePokemon({ types: ['Water', 'Fire'], spDefense: 80 });
    const flamethrower = makeMove({ type: 'Fire', power: 90, category: 'special' });

    const result = calculateDamage({ attacker, move: flamethrower, defender }, new FixedRandom(0.9));
    expect(result.effectiveness).toBeCloseTo(0.25);
  });

  it('STAB: Fire Pokémon using Fire move deals more damage than Normal Pokémon', () => {
    const fireAttacker = makePokemon({ types: ['Fire'], spAttack: 60 });
    const normalAttacker = makePokemon({ types: ['Normal'], spAttack: 60 });
    const defender = makePokemon({ types: ['Normal'], spDefense: 60 });
    const flamethrower = makeMove({ type: 'Fire', power: 90, category: 'special' });

    const withStab    = calculateDamage({ attacker: fireAttacker,   move: flamethrower, defender }, new FixedRandom(0.9));
    const withoutStab = calculateDamage({ attacker: normalAttacker, move: flamethrower, defender }, new FixedRandom(0.9));

    expect(withStab.stab).toBe(true);
    expect(withoutStab.stab).toBe(false);
    expect(withStab.damage).toBeGreaterThan(withoutStab.damage);
  });

  it('critical hit flag is set and increases damage', () => {
    const attacker = makePokemon();
    const defender = makePokemon();
    const move     = makeMove({ power: 80 });

    // FixedRandom(0.01): chance(p) → 0.01 > 0.5 → false
    // FixedRandom(0.9):  chance(p) → 0.9  > 0.5 → true  (critical)
    const normalResult = calculateDamage({ attacker, move, defender }, new FixedRandom(0.01));
    const critResult   = calculateDamage({ attacker, move, defender }, new FixedRandom(0.9));

    expect(normalResult.critical).toBe(false);
    expect(critResult.critical).toBe(true);
    expect(critResult.damage).toBeGreaterThan(normalResult.damage);
  });

  it('damage is always at least 1 (minimum damage floor)', () => {
    const weakAttacker = makePokemon({
      level: 1,
      attack: 1,
      spAttack: 1,
    });
    const tankDefender = makePokemon({
      defense: 255,
      spDefense: 255,
    });
    const weakMove = makeMove({ power: 1, category: 'physical' });

    const result = calculateDamage({ attacker: weakAttacker, move: weakMove, defender: tankDefender }, new FixedRandom(0.1));
    expect(result.damage).toBeGreaterThanOrEqual(1);
  });

  it('status moves (power 0) deal 0 damage', () => {
    const attacker = makePokemon();
    const defender = makePokemon();
    const statusMove = makeMove({ power: 0, category: 'status' });

    const result = calculateDamage({ attacker, move: statusMove, defender }, new FixedRandom(0.9));
    expect(result.damage).toBe(0);
  });

  it('is deterministic: same inputs produce identical output', () => {
    const attacker = makePokemon({ types: ['Fire'], spAttack: 90 });
    const defender = makePokemon({ types: ['Grass'], spDefense: 60 });
    const move     = makeMove({ type: 'Fire', power: 90, category: 'special' });

    const r1 = calculateDamage({ attacker, move, defender }, new BattleRandom(42));
    const r2 = calculateDamage({ attacker, move, defender }, new BattleRandom(42));
    expect(r1).toEqual(r2);
  });

  it('physical moves use attack/defense stats', () => {
    const physAttacker = makePokemon({ attack: 150, spAttack: 10 });
    const defender     = makePokemon({ defense: 50, spDefense: 200 });
    const physMove     = makeMove({ power: 80, category: 'physical' });

    const result = calculateDamage({ attacker: physAttacker, move: physMove, defender }, new FixedRandom(0.9));
    expect(result.damage).toBeGreaterThan(1);
  });

  it('special moves use spAttack/spDefense stats', () => {
    const specAttacker = makePokemon({ attack: 10, spAttack: 150 });
    const defender     = makePokemon({ defense: 200, spDefense: 50 });
    const specMove     = makeMove({ power: 80, category: 'special' });

    const result = calculateDamage({ attacker: specAttacker, move: specMove, defender }, new FixedRandom(0.9));
    expect(result.damage).toBeGreaterThan(1);
  });
});
