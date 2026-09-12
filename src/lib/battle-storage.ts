/**
 * Storage type for BattleTurn.events JSON column.
 * Persists both the events that occurred and the resulting state.
 */
import type { BattleEvent, BattleState } from '@/game/battle'

export interface TurnRecord {
  events: BattleEvent[]
  state: BattleState
}
