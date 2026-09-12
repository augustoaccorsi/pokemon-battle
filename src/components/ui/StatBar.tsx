interface StatBarProps {
  label: string
  value: number
  max?: number
}

function statColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio >= 0.66) return 'var(--battle-hp-full)'
  if (ratio >= 0.33) return 'var(--battle-hp-mid)'
  return 'var(--battle-hp-low)'
}

export function StatBar({ label, value, max = 255 }: StatBarProps) {
  const clampedValue = Math.max(0, Math.min(value, max))
  const percent = (clampedValue / max) * 100

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 36px 1fr',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily: 'inherit',
          fontSize: '0.45rem',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>

      {/* Numeric value */}
      <span
        style={{
          fontFamily: 'inherit',
          fontSize: '0.55rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          textAlign: 'right',
        }}
      >
        {value}
      </span>

      {/* Bar track */}
      <div
        style={{
          height: 10,
          background: 'var(--panel-dark)',
          border: '2px solid var(--panel-shadow)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: statColor(clampedValue, max),
            borderRadius: 1,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
