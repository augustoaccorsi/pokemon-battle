import { gymLeaders } from '@/lib/gym-leaders'
import GymLeaderGrid from './GymLeaderGrid'

export default function GymLeadersPage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <h1
            className="font-bold"
            style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--pokemon-red)' }}
          >
            KANTO GYM LEADERS
          </h1>
          <p
            className="mt-2"
            style={{ fontSize: '0.5rem', color: 'var(--text-secondary)' }}
          >
            Choose your opponent
          </p>
        </div>

        {/* Client component handles the interactive grid + difficulty modal */}
        <GymLeaderGrid leaders={gymLeaders} />
      </div>
    </div>
  )
}
