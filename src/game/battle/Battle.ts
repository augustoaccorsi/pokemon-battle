import type { BattleState, BattleSide, BattlePokemon } from './BattleState';
import type { BattleAction } from './BattleAction';
import type { BattleEvent } from './BattleEvent';
import { BattleRandom } from './Random';
import { resolveMove } from './MoveResolver';
import { resolveSwitch } from './SwitchResolver';
import { canMove, applyEndOfTurnStatus } from './StatusEffects';

export class Battle {
  private readonly state: BattleState;
  private readonly rng: BattleRandom;

  constructor(state: BattleState, rng?: BattleRandom) {
    this.state = state;
    this.rng   = rng ?? new BattleRandom(state.seed);
  }

  /** Returns a reference to the live battle state. */
  getState(): BattleState {
    return this.state;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Public turn entry point
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Executes one full turn:
   *   1. Determine enemy action (simple random AI)
   *   2. Resolve actions in priority/speed order
   *   3. Apply end-of-turn status effects
   *   4. Check victory/defeat
   *
   * All produced BattleEvents are appended to `state.log` and returned.
   */
  executeTurn(playerAction: BattleAction): BattleEvent[] {
    if (this.state.phase === 'ended') return [];

    this.state.phase = 'executing';

    const allEvents: BattleEvent[] = [];

    const enemyAction = this.getEnemyAction();

    // Determine turn order
    const [first, second] = this.determineTurnOrder(
      playerAction,
      enemyAction,
    );

    // Execute first action
    allEvents.push(...this.executeAction(first, playerAction, enemyAction));

    const end1 = this.checkGameOver();
    if (end1) {
      allEvents.push(end1);
      this.finalise(allEvents);
      return allEvents;
    }

    // Auto-switch any fainted active Pokémon before second action.
    allEvents.push(...this.autoSwitchFainted());

    // Execute second action
    allEvents.push(...this.executeAction(second, playerAction, enemyAction));

    const end2 = this.checkGameOver();
    if (end2) {
      allEvents.push(end2);
      this.finalise(allEvents);
      return allEvents;
    }

    allEvents.push(...this.autoSwitchFainted());

    // End-of-turn status effects
    allEvents.push(...this.applyEndOfTurnEffects());

    const end3 = this.checkGameOver();
    if (end3) {
      allEvents.push(end3);
      this.finalise(allEvents);
      return allEvents;
    }

    allEvents.push(...this.autoSwitchFainted());

    this.finalise(allEvents, false);
    return allEvents;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  /** Appends events to the log, increments the turn counter, and sets phase. */
  private finalise(events: BattleEvent[], ended = true): void {
    this.state.log.push(...events);
    this.state.turn++;
    this.state.phase = ended ? 'ended' : 'selecting';
  }

  // Enemy AI

  /**
   * Simple random AI: picks a random move that still has PP.
   * Falls back to the first move (Struggle placeholder) when all PP are 0.
   */
  private getEnemyAction(): BattleAction {
    const active = this.state.enemy.pokemon[this.state.enemy.activeIndex];
    const available = active.moves
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.currentPP > 0);

    if (available.length === 0) {
      return { type: 'MOVE', moveIndex: 0 };
    }

    const pick = available[this.rng.nextInt(0, available.length - 1)];
    return { type: 'MOVE', moveIndex: pick.i };
  }

  // Turn order

  /**
   * Returns the two actors in execution order:
   *   - Switches always precede moves.
   *   - Among moves: higher priority bracket goes first.
   *   - Same priority: faster Pokémon acts first.
   *   - Speed tie: random 50/50.
   */
  private determineTurnOrder(
    playerAction: BattleAction,
    enemyAction:  BattleAction,
  ): ['player' | 'enemy', 'player' | 'enemy'] {
    const pSwitch = playerAction.type === 'SWITCH';
    const eSwitch = enemyAction.type  === 'SWITCH';

    // Both switch — player goes first arbitrarily.
    if (pSwitch && eSwitch)  return ['player', 'enemy'];
    if (pSwitch && !eSwitch) return ['player', 'enemy'];
    if (!pSwitch && eSwitch) return ['enemy',  'player'];

    // Both use moves — compare priority then speed.
    const pActive = this.state.player.pokemon[this.state.player.activeIndex];
    const eActive = this.state.enemy.pokemon[this.state.enemy.activeIndex];

    const pPriority = playerAction.type === 'MOVE'
      ? (pActive.moves[playerAction.moveIndex]?.priority ?? 0)
      : 0;
    const ePriority = enemyAction.type === 'MOVE'
      ? (eActive.moves[enemyAction.moveIndex]?.priority ?? 0)
      : 0;

    if (pPriority > ePriority) return ['player', 'enemy'];
    if (ePriority > pPriority) return ['enemy',  'player'];

    if (pActive.speed > eActive.speed) return ['player', 'enemy'];
    if (eActive.speed > pActive.speed) return ['enemy',  'player'];

    // Speed tie — random.
    return this.rng.chance(0.5) ? ['player', 'enemy'] : ['enemy', 'player'];
  }

  // Action execution

  private executeAction(
    actor:        'player' | 'enemy',
    playerAction: BattleAction,
    enemyAction:  BattleAction,
  ): BattleEvent[] {
    const side     = actor === 'player' ? this.state.player : this.state.enemy;
    const oppSide  = actor === 'player' ? this.state.enemy  : this.state.player;
    const action   = actor === 'player' ? playerAction : enemyAction;
    const active   = side.pokemon[side.activeIndex];

    // Cannot act if fainted.
    if (active.currentHp <= 0) return [];

    if (action.type === 'SWITCH') {
      return resolveSwitch(side, actor, action.pokemonIndex);
    }

    // action.type === 'MOVE'
    const move = active.moves[action.moveIndex];
    if (!move) return [];

    // Check status condition.
    if (!canMove(active, this.rng)) {
      return []; // Pokémon couldn't act (paralysis, freeze, sleep).
    }

    const opponent = oppSide.pokemon[oppSide.activeIndex];
    return resolveMove(active, move, opponent, oppSide.id, this.rng);
  }

  // Auto-switch fainted active Pokémon

  /** For each side whose active Pokémon has fainted, auto-switch to the first living one. */
  private autoSwitchFainted(): BattleEvent[] {
    const events: BattleEvent[] = [];

    for (const side of [this.state.player, this.state.enemy] as BattleSide[]) {
      const active = side.pokemon[side.activeIndex];
      if (active.currentHp > 0) continue;

      const nextIdx = this.findNextLiving(side);
      if (nextIdx === null) continue; // whole side wiped — game-over check handles it

      events.push(...resolveSwitch(side, side.id, nextIdx));
    }

    return events;
  }

  /** Returns the index of the first living, non-active Pokémon, or null. */
  private findNextLiving(side: BattleSide): number | null {
    for (let i = 0; i < side.pokemon.length; i++) {
      if (i !== side.activeIndex && side.pokemon[i].currentHp > 0) {
        return i;
      }
    }
    return null;
  }

  // End-of-turn status

  private applyEndOfTurnEffects(): BattleEvent[] {
    const events: BattleEvent[] = [];

    for (const side of [this.state.player, this.state.enemy] as BattleSide[]) {
      const active = side.pokemon[side.activeIndex];
      if (active.currentHp <= 0) continue;

      const result = applyEndOfTurnStatus(active);
      if (!result || result.damage <= 0) continue;

      events.push({
        type:    'STATUS',
        side:    side.id,
        pokemon: active.name,
        status:  active.status ?? 'none',
        applied: false, // false = end-of-turn trigger, not a new application
      });

      if (active.currentHp <= 0) {
        events.push({ type: 'FAINT', side: side.id, pokemon: active.name });
      }
    }

    return events;
  }

  // Victory check

  /**
   * Returns a BattleEndEvent if one side has all Pokémon at 0 HP,
   * otherwise returns null. Also sets state.winner.
   */
  private checkGameOver(): BattleEvent | null {
    const playerWiped = this.allFainted(this.state.player);
    const enemyWiped  = this.allFainted(this.state.enemy);

    if (playerWiped) {
      this.state.winner = 'enemy';
      return { type: 'BATTLE_END', winner: 'enemy' };
    }
    if (enemyWiped) {
      this.state.winner = 'player';
      return { type: 'BATTLE_END', winner: 'player' };
    }
    return null;
  }

  private allFainted(side: BattleSide): boolean {
    return side.pokemon.every((p: BattlePokemon) => p.currentHp <= 0);
  }
}
