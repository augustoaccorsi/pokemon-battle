import { gymLeaders } from '@/lib/gym-leaders'
import GymLeaderGrid from './GymLeaderGrid'

const REGIONS = [
  { key: 'kanto', label: 'KANTO', color: 'var(--pokemon-red)' },
  { key: 'johto', label: 'JOHTO', color: '#4a90d9' },
  { key: 'hoenn', label: 'HOENN', color: '#27ae60' },
] as const

export default function GymLeadersPage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <h1
            className="font-bold"
            style={{ fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--pokemon-red)' }}
          >
            GYM LEADERS
          </h1>
          <p
            className="mt-2"
            style={{ fontSize: '0.5rem', color: 'var(--text-secondary)' }}
          >
            Choose your opponent
          </p>
        </div>

        {REGIONS.map(({ key, label, color }) => {
          const regionLeaders = gymLeaders.filter(l => l.region === key)
          return (
            <section key={key} className="flex flex-col gap-3">
              <h2
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color,
                  borderBottom: `2px solid ${color}`,
                  paddingBottom: '4px',
                }}
              >
                ◈ {label} REGION
              </h2>
              <GymLeaderGrid leaders={regionLeaders} />
            </section>
          )
        })}
      </div>
    </div>
  )
}
