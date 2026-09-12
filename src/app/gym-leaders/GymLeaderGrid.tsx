'use client'

import { useRouter } from 'next/navigation'
import type { GymLeaderData } from '@/lib/gym-leaders'
import { GymLeaderCard } from '@/components/battle/GymLeaderCard'

interface GymLeaderGridProps {
  leaders: GymLeaderData[]
}

type Difficulty = 'normal' | 'hard' | 'challenge'

export default function GymLeaderGrid({ leaders }: GymLeaderGridProps) {
  const router = useRouter()

  function handleSelect(leaderId: number, difficulty: Difficulty) {
    // In a full app, teamId would come from session/context.
    // For the scaffold we store a pending battle params and let the battle page
    // handle team selection or use a stored teamId from localStorage.
    const params = new URLSearchParams({
      leaderId: String(leaderId),
      difficulty,
    })
    router.push(`/battle?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {leaders.map(leader => (
        <GymLeaderCard
          key={leader.id}
          leader={leader}
          onSelect={diff => handleSelect(leader.id, diff)}
        />
      ))}
    </div>
  )
}
