'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HomeButton() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <nav
      style={{
        position: 'fixed',
        top: 10,
        left: 12,
        zIndex: 50,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
          fontSize: '0.45rem',
          letterSpacing: '0.08em',
          textDecoration: 'none',
          color: '#fff',
          background: 'var(--pokemon-red)',
          border: '2px solid rgba(0,0,0,0.4)',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          padding: '5px 10px',
          display: 'inline-block',
          borderRadius: 3,
        }}
      >
        ◀ HOME
      </Link>
    </nav>
  )
}
