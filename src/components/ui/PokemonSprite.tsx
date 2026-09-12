import Image from 'next/image'

const SIZES: Record<string, number> = {
  sm:  48,
  md:  96,
  lg: 128,
  xl: 200,
}

/* Generic Pokémon silhouette – a simple pixelated blob SVG */
const PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="12" y="2"  width="8"  height="4" fill="#5A4A3A"/>
  <rect x="8"  y="6"  width="16" height="4" fill="#5A4A3A"/>
  <rect x="6"  y="10" width="20" height="6" fill="#5A4A3A"/>
  <rect x="4"  y="16" width="24" height="6" fill="#5A4A3A"/>
  <rect x="6"  y="22" width="20" height="4" fill="#5A4A3A"/>
  <rect x="8"  y="26" width="6"  height="4" fill="#5A4A3A"/>
  <rect x="18" y="26" width="6"  height="4" fill="#5A4A3A"/>
  <rect x="14" y="10" width="4"  height="4" fill="#F8F0D8"/>
  <rect x="14" y="10" width="2"  height="2" fill="#2C1810"/>
</svg>
`.trim()

const PLACEHOLDER_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`

interface PokemonSpriteProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shiny?: boolean
  back?: boolean
}

export function PokemonSprite({
  src,
  name,
  size = 'md',
  shiny = false,
  back = false,
}: PokemonSpriteProps) {
  const px = SIZES[size] ?? 96
  const imgSrc = src ?? PLACEHOLDER_DATA_URI

  return (
    <div
      style={{
        width: px,
        height: px,
        position: 'relative',
        display: 'inline-block',
        flexShrink: 0,
      }}
      title={`${name}${shiny ? ' (shiny)' : ''}${back ? ' (back)' : ''}`}
    >
      <Image
        src={imgSrc}
        alt={name}
        width={px}
        height={px}
        style={{
          imageRendering: 'pixelated',
          transform: back ? 'scaleX(-1)' : undefined,
        }}
        unoptimized
      />
    </div>
  )
}
