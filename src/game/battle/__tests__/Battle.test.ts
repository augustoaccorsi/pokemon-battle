import { describe, it, expect } from 'vitest';
import { Battle } from '../Battle';
import { BattleRandom } from '../Random';
import type { BattleState, BattlePokemon, BattleMove, BattleSide } from '../BattleState';
import type { BattleAction } from '../BattleAction';
import type { BattleEvent } from '../BattleEvent';

// ──────────────────────────────────────────────────────────────────────────────
// FixedRandom
// ──────────────────────────────────────────────────────────────────────────────
// value > 0.5  → chance() returns true  (paralysis blocks, accuracy misses, etc.)
// value <= 0.5 → chance() returns false
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

// ──────────────────────────────────────────────────────────────────────────────
// Factories
// ──────────────────────────────────────────────────────────────────────────────

function makeMove(overrides: Partial<BattleMove> = {}): BattleMove {
  return {
    id: 'tackle',
    name: 'Tackle',
    type: 'Normal',
    category: 'physical',
    power: 40,
    // accuracy: undefined → always hits in MoveResolver
    currentPP: 35,
    maxPP: 35,
    priority: 0,
    ...overrides,
  };
}

function makePokemon(overrides: Partial<BattlePokemon> = {}): BattlePokemon {
  return {
    id: 'p1',
    name: 'TestMon',
    currentHp: 300,
    maxHp: 300,
    level: 50,
    attack: 80,
    defense: 80,
    spAttack: 80,
    spDefense: 80,
    speed: 80,
    types: ['Normal'],
    moves: [makeMove()],
    status: 'none',
    isActive: true,
    ...overrides,
  };
}

function makeSide(
  pokemon: BattlePokemon[],
  id: 'player' | 'enemy',
): BattleSide {
  return { pokemon, activeIndex: 0, id };
}

function makeState(
  playerPokemon: BattlePokemon[] = [makePokemon({ id: 'player1', name: 'PlayerMon' })],
  enemyPokemon:  BattlePokemon[] = [makePokemon({ id: 'enemy1',  name: 'EnemyMon'  })],
): BattleState {
  return {
    id:     'test-battle',
    seed:   'test',
    turn:   1,
    phase:  'selecting',
    winner: undefined,
    log:    [],
    player: makeSide(playerPokemon, 'player'),
    enemy:  makeSide(enemyPokemon,  'enemy'),
  };
}

function playerMove(moveIndex = 0): BattleAction {
  return { type: 'MOVE', moveIndex };
}

function playerSwitch(pokemonIndex: number): BattleAction {
  return { type: 'SWITCH', pokemonIndex };
}

function filterEvents(events: BattleEvent[], type: string): BattleEvent[] {
  return events.filter(e => e.type === type);
}

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe('Battle.executeTurn', () => {
  // ── Turn order ────────────────────────────────────────────────────────────

  it('faster Pokémon moves first', () => {
    const fastPlayer = makePokemon({ id: 'fast', name: 'FastMon', speed: 150 });
    const slowEnemy  = makePokemon({ id: 'slow', name: 'SlowMon', speed: 40  });
    const state  = makeState([fastPlayer], [slowEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events     = battle.executeTurn(playerMove());
    const moveEvents = filterEvents(events, 'MOVE_USED');
    // FastMon should have acted first
    expect(moveEvents.length).toBeGreaterThanOrEqual(1);
    expect((moveEvents[0] as { attacker: string }).attacker).toBe('FastMon');
  });

  it('slower Pokémon moves second', () => {
    const slowPlayer = makePokemon({ name: 'SlowPlayer', speed: 40  });
    const fastEnemy  = makePokemon({ name: 'FastEnemy',  speed: 150 });
    const state  = makeState([slowPlayer], [fastEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events     = battle.executeTurn(playerMove());
    const moveEvents = filterEvents(events, 'MOVE_USED');
    if (moveEvents.length >= 2) {
      // Enemy (fast) first, then player (slow)
      expect((moveEvents[0] as { attacker: string }).attacker).toBe('FastEnemy');
      expect((moveEvents[1] as { attacker: string }).attacker).toBe('SlowPlayer');
    }
  });

  it('+1 priority move goes before a normal move even if the attacker is slower', () => {
    const slowPlayer = makePokemon({
      name:  'SlowPlayer',
      speed: 20,
      moves: [makeMove({ id: 'quick-attack', name: 'Quick Attack', priority: 1 })],
    });
    const fastEnemy = makePokemon({ name: 'FastEnemy', speed: 200 });
    const state  = makeState([slowPlayer], [fastEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events     = battle.executeTurn(playerMove());
    const moveEvents = filterEvents(events, 'MOVE_USED');
    expect(moveEvents.length).toBeGreaterThanOrEqual(1);
    expect((moveEvents[0] as { attacker: string }).attacker).toBe('SlowPlayer');
  });

  it('-1 priority move goes after a normal move even if the attacker is faster', () => {
    const fastPlayer = makePokemon({
      name:  'FastPlayer',
      speed: 200,
      moves: [makeMove({ id: 'vital-throw', name: 'Vital Throw', priority: -1 })],
    });
    const slowEnemy = makePokemon({ name: 'SlowEnemy', speed: 10 });
    const state  = makeState([fastPlayer], [slowEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events     = battle.executeTurn(playerMove());
    const moveEvents = filterEvents(events, 'MOVE_USED');
    expect(moveEvents.length).toBeGreaterThanOrEqual(1);
    expect((moveEvents[0] as { attacker: string }).attacker).toBe('SlowEnemy');
  });

  // ── MOVE_USED event ───────────────────────────────────────────────────────

  it('MOVE_USED event contains attacker name and move name', () => {
    const player = makePokemon({
      name:  'Charmander',
      speed: 200, // go first
      moves: [makeMove({ id: 'ember', name: 'Ember' })],
    });
    const state  = makeState([player]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events = battle.executeTurn(playerMove());
    const mu = events.find(e => e.type === 'MOVE_USED' && (e as { attacker: string }).attacker === 'Charmander');
    expect(mu).toBeDefined();
    expect((mu as { move: string }).move).toBe('Ember');
  });

  // ── FAINT ─────────────────────────────────────────────────────────────────

  it('FAINT event is emitted when a Pokémon reaches 0 HP', () => {
    const strongPlayer = makePokemon({
      name:  'StrongMon',
      speed: 200,
      attack: 255,
      moves: [makeMove({ power: 250 })],
    });
    const weakEnemy = makePokemon({ name: 'WeakMon', currentHp: 1, maxHp: 100 });
    const state  = makeState([strongPlayer], [weakEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events = battle.executeTurn(playerMove());
    const faints = filterEvents(events, 'FAINT');
    expect(faints.some(e => (e as { pokemon: string }).pokemon === 'WeakMon')).toBe(true);
  });

  // ── SWITCH ────────────────────────────────────────────────────────────────

  it('SWITCH action swaps the active Pokémon and emits SWITCH event', () => {
    const p1 = makePokemon({ id: 'p1', name: 'Mon1', isActive: true  });
    const p2 = makePokemon({ id: 'p2', name: 'Mon2', isActive: false });
    const state  = makeState([p1, p2]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events = battle.executeTurn(playerSwitch(1));
    const sw = events.find(e => e.type === 'SWITCH') as { inPokemon: string } | undefined;
    expect(sw).toBeDefined();
    expect(sw?.inPokemon).toBe('Mon2');
    expect(battle.getState().player.activeIndex).toBe(1);
  });

  // ── PP ────────────────────────────────────────────────────────────────────

  it('PP is decremented by 1 after a move is used', () => {
    const player = makePokemon({
      name: 'PPTester',
      speed: 200,
      moves: [makeMove({ currentPP: 10 })],
    });
    const state  = makeState([player]);
    const battle = new Battle(state, new FixedRandom(0.9));

    battle.executeTurn(playerMove());
    expect(battle.getState().player.pokemon[0].moves[0].currentPP).toBe(9);
  });

  // ── HP floor ──────────────────────────────────────────────────────────────

  it('HP cannot go below 0', () => {
    const strongPlayer = makePokemon({
      name:  'Crusher',
      speed: 200,
      attack: 255,
      moves: [makeMove({ power: 999 })],
    });
    const glassEnemy = makePokemon({ name: 'Glass', currentHp: 1, maxHp: 100 });
    const state  = makeState([strongPlayer], [glassEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    battle.executeTurn(playerMove());
    const hp = battle.getState().enemy.pokemon[0].currentHp;
    expect(hp).toBeGreaterThanOrEqual(0);
  });

  // ── BATTLE_END / victory ──────────────────────────────────────────────────

  it('BATTLE_END winner=player when all enemy Pokémon faint', () => {
    const strongPlayer = makePokemon({
      name:  'Winner',
      speed: 200,
      attack: 255,
      moves: [makeMove({ power: 999 })],
    });
    const weakEnemy = makePokemon({ name: 'Loser', currentHp: 1, maxHp: 100 });
    const state  = makeState([strongPlayer], [weakEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events = battle.executeTurn(playerMove());
    const end = events.find(e => e.type === 'BATTLE_END') as { winner: string } | undefined;
    expect(end).toBeDefined();
    expect(end?.winner).toBe('player');
  });

  it('BATTLE_END winner=enemy when all player Pokémon faint', () => {
    const weakPlayer = makePokemon({
      name: 'GlassPlayer',
      currentHp: 1,
      maxHp: 100,
      speed: 10, // moves second
    });
    const strongEnemy = makePokemon({
      name:  'StrongEnemy',
      speed: 200,
      attack: 255,
      moves: [makeMove({ power: 999 })],
    });
    const state  = makeState([weakPlayer], [strongEnemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    const events = battle.executeTurn(playerMove());
    const end = events.find(e => e.type === 'BATTLE_END') as { winner: string } | undefined;
    expect(end).toBeDefined();
    expect(end?.winner).toBe('enemy');
  });

  // ── Status: paralysis ─────────────────────────────────────────────────────

  it('paralyzed Pokémon may not move when the paralysis roll fires', () => {
    // FixedRandom(0.9): chance(p) → 0.9 > 0.5 → true
    // canMove for paralysis: return !rng.chance(0.25)
    // → !true → false → cannot move
    const paralyzedPlayer = makePokemon({
      name:   'Paralyzed',
      speed:  200, // would normally go first
      status: 'paralysis',
    });
    const enemy = makePokemon({ name: 'Normal', speed: 10 });
    const state  = makeState([paralyzedPlayer], [enemy]);
    // FixedRandom(0.9) causes all chance() calls to return true, which means:
    // - paralysis check: !chance(0.25) = !true = false → skip
    const battle = new Battle(state, new FixedRandom(0.9));

    const events       = battle.executeTurn(playerMove());
    const playerMoves  = filterEvents(events, 'MOVE_USED').filter(
      e => (e as { attacker: string }).attacker === 'Paralyzed',
    );
    expect(playerMoves.length).toBe(0);
  });

  // ── Burn ─────────────────────────────────────────────────────────────────

  it('burn deals 1/8 max HP damage at end of turn', () => {
    const burnedPlayer = makePokemon({
      name:     'Burned',
      speed:    200,
      currentHp: 200,
      maxHp:    200,
      status:   'burn',
      // Status move so no physical damage complicates the HP math
      moves:    [makeMove({ id: 'growl', name: 'Growl', category: 'status', power: 0 })],
    });
    const enemy = makePokemon({
      name: 'Normal',
      speed: 10,
      moves: [makeMove({ id: 'growl', name: 'Growl', category: 'status', power: 0 })],
    });
    const state  = makeState([burnedPlayer], [enemy]);
    const battle = new Battle(state, new FixedRandom(0.9));

    battle.executeTurn(playerMove());

    const finalHp       = battle.getState().player.pokemon[0].currentHp;
    const expectedBurnDmg = Math.max(1, Math.floor(200 / 8)); // 25
    expect(finalHp).toBe(200 - expectedBurnDmg);
  });

  // ── Miss ─────────────────────────────────────────────────────────────────

  it('MISSED event is emitted when accuracy check fails', () => {
    // FixedRandom(0.1): chance(accuracy/100) → 0.1 > 0.5 → false → miss
    const player = makePokemon({
      name:  'Wildly',
      speed: 200,
      moves: [makeMove({ accuracy: 50 })], // provided accuracy triggers the check
    });
    const enemy  = makePokemon({ name: 'Target' });
    const state  = makeState([player], [enemy]);
    const battle = new Battle(state, new FixedRandom(0.1));

    const events = battle.executeTurn(playerMove());
    const missed = filterEvents(events, 'MISSED');
    expect(missed.some(e => (e as { attacker: string }).attacker === 'Wildly')).toBe(true);
  });

  // ── Deterministic replay ──────────────────────────────────────────────────

  it('same seed produces identical events for the same action', () => {
    const b1 = new Battle(makeState(), new BattleRandom('replay-seed'));
    const b2 = new Battle(makeState(), new BattleRandom('replay-seed'));

    const e1 = b1.executeTurn(playerMove());
    const e2 = b2.executeTurn(playerMove());

    expect(e1).toEqual(e2);
  });

  it('deterministic over multiple turns with the same seed', () => {
    const buildBattle = () => new Battle(makeState(), new BattleRandom('multi-turn-seed'));

    const b1 = buildBattle();
    const b2 = buildBattle();

    for (let i = 0; i < 3; i++) {
      const e1 = b1.executeTurn(playerMove());
      const e2 = b2.executeTurn(playerMove());
      expect(e1).toEqual(e2);
    }
  });
});
