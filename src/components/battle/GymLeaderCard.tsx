'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GymLeaderData } from '@/lib/gym-leaders'

type Difficulty = 'normal' | 'hard' | 'challenge'

interface GymLeaderCardProps {
  leader: GymLeaderData
  onSelect: (difficulty: Difficulty) => void
}

const TYPE_BG: Record<string, string> = {
  rock: 'var(--type-rock)',
  water: 'var(--type-water)',
  electric: 'var(--type-electric)',
  grass: 'var(--type-grass)',
  poison: 'var(--type-poison)',
  psychic: 'var(--type-psychic)',
  fire: 'var(--type-fire)',
  ground: 'var(--type-ground)',
  normal: 'var(--type-normal)',
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  normal: 'NORMAL',
  hard: 'HARD',
  challenge: 'CHALLENGE',
}

export function GymLeaderCard({ leader, onSelect }: GymLeaderCardProps) {
  const [showModal, setShowModal] = useState(false)

  const typeBg = TYPE_BG[leader.typeName.toLowerCase()] ?? 'var(--type-normal)'

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="panel flex flex-col gap-2 p-3 text-left w-full cursor-pointer"
      >
        {/* Type banner */}
        <div
          className="w-full rounded-sm flex items-center justify-center py-1"
          style={{ background: typeBg }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: '0.5rem',
              color: '#fff',
              textShadow: '1px 1px 0 rgba(0,0,0,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {leader.typeName}
          </span>
        </div>

        {/* Name */}
        <p
          className="font-bold"
          style={{ fontSize: '0.65rem', letterSpacing: '0.03em', color: 'var(--text-primary)' }}
        >
          {leader.name}
        </p>

        {/* City */}
        <p style={{ fontSize: '0.45rem', color: 'var(--text-secondary)' }}>
          {leader.city}
        </p>

        {/* Badge */}
        <div
          className="panel-dark rounded-sm px-1 py-0.5 self-start"
          style={{ fontSize: '0.4rem' }}
        >
          {leader.badge}
        </div>
      </motion.button>

      {/* Difficulty modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="panel flex flex-col gap-3 p-4 max-w-xs w-full mx-4"
              initial={{ scale: 0.85, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <p
                className="font-bold text-center"
                style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                {leader.name}
              </p>
              <p
                className="text-center"
                style={{ fontSize: '0.5rem', color: 'var(--text-secondary)' }}
              >
                Select difficulty
              </p>

              {(['normal', 'hard', 'challenge'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    setShowModal(false)
                    onSelect(diff)
                  }}
                  className="battle-btn w-full text-center"
                  style={{ fontSize: '0.6rem' }}
                >
                  {DIFFICULTY_LABELS[diff]}
                </button>
              ))}

              <button
                onClick={() => setShowModal(false)}
                className="battle-btn w-full text-center opacity-60"
                style={{ fontSize: '0.5rem' }}
              >
                CANCEL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
