'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface BattleMessageProps {
  messages: string[]
  /** Index of the message currently being displayed */
  current: number
  /** Called when user advances past the last message */
  onDone?: () => void
}

const CHAR_DELAY_MS = 35

export function BattleMessage({ messages, current, onDone }: BattleMessageProps) {
  const text = messages[current] ?? ''
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  // Reset typewriter when message changes
  useEffect(() => {
    setDisplayed('')
    setDone(false)

    if (!text) return

    let i = 0
    const interval = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, CHAR_DELAY_MS)

    return () => clearInterval(interval)
  }, [text])

  function handleAdvance() {
    if (!done) {
      // Skip typewriter — show full text immediately
      setDisplayed(text)
      setDone(true)
      return
    }
    onDone?.()
  }

  const isLast = current >= messages.length - 1

  return (
    <button
      onClick={handleAdvance}
      className="w-full text-left focus:outline-none"
      aria-label="Advance battle message"
    >
      <div
        className="panel relative min-h-[80px] px-4 py-3 cursor-pointer select-none"
        style={{ borderWidth: '3px' }}
      >
        <p
          className="leading-relaxed"
          style={{ fontSize: '0.6rem', letterSpacing: '0.05em', minHeight: '2.4em' }}
        >
          {displayed}
          {/* blinking cursor while typing */}
          {!done && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              aria-hidden
            >
              ▮
            </motion.span>
          )}
        </p>

        {/* Arrow to advance — visible only when typing is done and more messages exist */}
        {done && !isLast && (
          <motion.span
            className="absolute bottom-2 right-3"
            style={{ fontSize: '0.5rem' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            aria-hidden
          >
            ▼
          </motion.span>
        )}
      </div>
    </button>
  )
}
