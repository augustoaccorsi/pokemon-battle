'use client'

import { motion } from 'framer-motion'

interface HpBarProps {
  current: number
  max: number
  animated?: boolean
}

function getHpClass(ratio: number): string {
  if (ratio > 0.5) return 'hp-bar-full'
  if (ratio > 0.25) return 'hp-bar-mid'
  return 'hp-bar-low'
}

function getHpColor(ratio: number): string {
  if (ratio > 0.5) return 'var(--battle-hp-full)'
  if (ratio > 0.25) return 'var(--battle-hp-mid)'
  return 'var(--battle-hp-low)'
}

export function HpBar({ current, max, animated = true }: HpBarProps) {
  const safeCurrent = Math.max(0, Math.min(current, max))
  const ratio = max > 0 ? safeCurrent / max : 0
  const percent = ratio * 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* HP Label */}
      <span
        style={{
          fontFamily: 'inherit',
          fontSize: '0.55rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          minWidth: 20,
          letterSpacing: '0.05em',
        }}
      >
        HP
      </span>

      {/* Track */}
      <div
        style={{
          flex: 1,
          height: 10,
          background: 'var(--panel-dark)',
          border: '2px solid var(--panel-shadow)',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {animated ? (
          <motion.div
            className={getHpClass(ratio)}
            style={{ height: '100%', borderRadius: 1 }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={getHpClass(ratio)}
            style={{ height: '100%', width: `${percent}%`, borderRadius: 1 }}
          />
        )}
      </div>

      {/* Fraction */}
      <span
        style={{
          fontFamily: 'inherit',
          fontSize: '0.5rem',
          color: getHpColor(ratio),
          minWidth: 52,
          textAlign: 'right',
          letterSpacing: '0.02em',
        }}
      >
        {safeCurrent}/{max}
      </span>
    </div>
  )
}
