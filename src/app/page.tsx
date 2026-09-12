'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Link from 'next/link'

interface MenuItem {
  icon: string
  label: string
  href: string
  description: string
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '📖', label: 'Pokédex',          href: '/pokedex', description: 'Browse Gen I–III Pokémon' },
  { icon: '⚔️',  label: 'Battle Simulator', href: '/battle',  description: 'Fight gym leaders' },
  { icon: '👥', label: 'Build Your Team',  href: '/team',    description: 'Assemble your party' },
  { icon: '🏆', label: 'Gym Leaders',      href: '/gym',     description: 'View all challengers' },
]

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function HomePage() {
  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--panel-dark)',
        padding:        16,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          width:     '100%',
          maxWidth:  480,
          background: 'var(--panel-light)',
          border:     '4px solid var(--panel-border)',
          boxShadow:  '4px 4px 0 var(--panel-shadow)',
          borderRadius: 6,
          overflow:   'hidden',
        }}
      >
        {/* ── Header ─────────────────────────────── */}
        <div
          style={{
            background:    'var(--pokemon-red)',
            padding:       '16px 20px',
            textAlign:     'center',
            borderBottom:  '4px solid var(--panel-shadow)',
          }}
        >
          <div style={{ fontFamily: 'inherit', fontSize: '0.6rem', color: 'var(--pokemon-yellow)', marginBottom: 6, letterSpacing: '0.04em' }}>
            ◆ ◆ ◆
          </div>
          <h1
            style={{
              fontFamily:    'inherit',
              fontSize:      'clamp(0.65rem, 3vw, 0.9rem)',
              color:         '#fff',
              margin:        0,
              letterSpacing: '0.06em',
              lineHeight:    1.5,
              textShadow:    '2px 2px 0 rgba(0,0,0,0.4)',
            }}
          >
            POKÉMON<br />BATTLE SIMULATOR
          </h1>
          <div style={{ fontFamily: 'inherit', fontSize: '0.45rem', color: 'var(--pokemon-yellow)', marginTop: 8, letterSpacing: '0.1em' }}>
            GEN I · II · III
          </div>
        </div>

        {/* ── Menu items ─────────────────────────── */}
        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          style={{ padding: '8px 0' }}
        >
          {MENU_ITEMS.map((m) => (
            <motion.div key={m.href} variants={item}>
              <Link
                href={m.href}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="battle-btn"
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           14,
                    padding:       '12px 20px',
                    borderLeft:    'none',
                    borderRight:   'none',
                    borderRadius:  0,
                    borderTop:     'none',
                    borderBottom:  'var(--pixel-border)',
                    width:         '100%',
                    textAlign:     'left',
                    background:    'var(--panel-light)',
                    transition:    'background 0.1s, padding-left 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.background    = 'var(--pokemon-yellow)'
                    el.style.paddingLeft   = '26px'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.background    = 'var(--panel-light)'
                    el.style.paddingLeft   = '20px'
                  }}
                >
                  {/* Icon */}
                  <span
                    style={{
                      fontSize:   '1.4rem',
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    {m.icon}
                  </span>

                  {/* Text */}
                  <div>
                    <div
                      style={{
                        fontFamily:    'inherit',
                        fontSize:      '0.6rem',
                        fontWeight:    'bold',
                        color:         'var(--text-primary)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontFamily:   'inherit',
                        fontSize:     '0.4rem',
                        color:        'var(--text-secondary)',
                        marginTop:    3,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {m.description}
                    </div>
                  </div>

                  {/* Arrow */}
                  <span
                    style={{
                      marginLeft:  'auto',
                      fontFamily:  'inherit',
                      fontSize:    '0.7rem',
                      color:       'var(--text-secondary)',
                      flexShrink:  0,
                    }}
                  >
                    ▶
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* ── Footer ─────────────────────────────── */}
        <div
          style={{
            background:   'var(--panel-dark)',
            padding:      '10px 20px',
            textAlign:    'center',
            borderTop:    '4px solid var(--panel-shadow)',
          }}
        >
          <p
            style={{
              fontFamily:    'inherit',
              fontSize:      '0.38rem',
              color:         'var(--text-on-dark)',
              opacity:       0.6,
              margin:        0,
              letterSpacing: '0.05em',
              lineHeight:    1.8,
            }}
          >
            Fan project — not an official Pokémon product.<br />
            Pokémon © Nintendo / Game Freak / Creatures Inc.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
