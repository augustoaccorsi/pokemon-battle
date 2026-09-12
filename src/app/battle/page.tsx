'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BattleScreen } from '@/components/battle/BattleScreen'

const STORAGE_KEY = 'activeBattleId'

export default function BattlePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [battleId, setBattleId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  // Query params from gym-leader selection
  const leaderIdParam = searchParams.get('leaderId')
  const difficultyParam = searchParams.get('difficulty') as
    | 'normal'
    | 'hard'
    | 'challenge'
    | null
  // battleId can also be passed directly (for resuming)
  const battleIdParam = searchParams.get('battleId')

  useEffect(() => {
    // 1. Resume via explicit battleId query param
    if (battleIdParam) {
      setBattleId(battleIdParam)
      localStorage.setItem(STORAGE_KEY, battleIdParam)
      return
    }

    // 2. Resume from localStorage (no query params)
    if (!leaderIdParam && !difficultyParam) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setBattleId(stored)
        return
      }
      // Nothing to load — go back to leader selection
      router.replace('/gym-leaders')
      return
    }

    // 3. Create a new battle from query params
    if (!leaderIdParam || !difficultyParam) return

    void (async () => {
      setCreating(true)
      setError(null)
      try {
        // In a full app, teamId comes from session/profile.
        // For the scaffold, we use a fixed placeholder teamId stored in localStorage.
        const teamId = localStorage.getItem('activeTeamId') ?? 'placeholder-team'

        const res = await fetch('/api/battles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId,
            gymLeaderId: Number(leaderIdParam),
            difficulty: difficultyParam,
          }),
        })

        if (!res.ok) {
          const errBody = (await res.json()) as { error?: string }
          throw new Error(errBody.error ?? 'Failed to create battle')
        }

        const { battleId: newId } = (await res.json()) as { battleId: string }
        localStorage.setItem(STORAGE_KEY, newId)
        setBattleId(newId)

        // Clean up URL
        router.replace(`/battle?battleId=${newId}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setCreating(false)
      }
    })()
  }, [battleIdParam, leaderIdParam, difficultyParam, router])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p style={{ fontSize: '0.6rem', color: 'var(--pokemon-red)' }}>{error}</p>
        <button
          className="battle-btn"
          onClick={() => router.push('/gym-leaders')}
          style={{ fontSize: '0.55rem' }}
        >
          ← BACK
        </button>
      </div>
    )
  }

  if (creating || !battleId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p
          style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
          className="animate-pulse"
        >
          {creating ? 'PREPARING BATTLE…' : 'LOADING…'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Back navigation */}
      <div className="px-2 pt-2">
        <button
          className="battle-btn"
          style={{ fontSize: '0.45rem' }}
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY)
            router.push('/gym-leaders')
          }}
        >
          ← FLEE
        </button>
      </div>

      {/* Battle screen fills remaining height */}
      <div className="flex-1 flex flex-col">
        <BattleScreen battleId={battleId} />
      </div>
    </div>
  )
}
