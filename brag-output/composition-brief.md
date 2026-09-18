# Hyperframes Composition Brief: Pokémon Battle Simulator

## Objective
Create a short launch-style brag video for the Pokémon Battle Simulator — a full Gen I–III browser battle simulator with a faithful FireRed/LeafGreen pixel aesthetic.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1280×720
- Duration: 21 seconds

## Source Material
- Project root: `/Users/i851169/dev/pokemon-battle`
- Primary files read: `README.md`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/gym-leaders/page.tsx`, `src/components/battle/BattleScreen.tsx`, `src/components/battle/GymLeaderCard.tsx`
- Product name: Pokémon Battle Simulator
- Tagline / strongest claim: "Gen III damage formula, status effects, priority moves, seeded-RNG replays. 57 unit tests."
- Key UI or visual moment to recreate: The Game Boy-style panel widget (cream bg, red header, pixel border + hard shadow), the home menu with staggered rows, the gym leader cards with type-colored banners, the battle HP bars + move menu.
- Copy that must appear verbatim:
  - `POKÉMON BATTLE SIMULATOR`
  - `GEN I · II · III`
  - `57 UNIT TESTS.`
  - `GEN III DAMAGE FORMULA.`
  - `SEEDED RNG.`
  - `Fan project — not an official Pokémon product.`

## Creative Direction
- Tone preset: `default`
- Creative direction: "A Game Boy game, in your browser, with 57 unit tests"
- Interpretation: Warm, playful pacing. The humor comes from the product's absurd completeness — play it straight. Typography uses or closely echoes `"Press Start 2P"` (pixel font). Transitions are clean crossfades or slides. No aggressive cuts.
- Angle: Someone built a rigorous, complete Pokémon game engine in Next.js + TypeScript. The video shows it off honestly and lands the real-app disclaimer as the deadpan punchline.
- Hook: The exact panel widget from the app appears with the red header — `◆ ◆ ◆`, then `POKÉMON BATTLE SIMULATOR`, then `GEN I · II · III` in yellow.
- Outro / punchline: Stats land one-by-one, then the real footer disclaimer fills the screen: `"Fan project — not an official Pokémon product."` over panel-dark + music fade.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated redesign — stay faithful to the actual design tokens
  - Modern gradients or shadows that don't match the pixel aesthetic

## Visual Identity
- Background (outer): `#5A4A3A` (panel-dark)
- Panel surface: `#F8F0D8` (panel-light, cream)
- Header accent: `#CC0000` (pokemon-red)
- Highlight / hover: `#FFDE00` (pokemon-yellow)
- Text on panel: `#2C1810` (text-primary)
- Text on dark: `#F8F0D8` (text-on-dark)
- Border: `4px solid #8B7355` (panel-border)
- Hard shadow: `4px 4px 0 #3A2A1A` (panel-shadow)
- Display font: `"Press Start 2P", "Courier New", monospace` — this is the ONLY font in the app, used for all text at very small sizes (0.4–0.9rem)
- Body font: same
- Visual references from the project:
  - The panel widget: cream card, thick pixel border, hard shadow, 4px red header strip
  - Menu rows: cream bg, hover → yellow bg + ▶ arrow
  - Type badges: colored banner (Rock=#B8A038, Water=#6890F0, Electric=#F8D030, Grass=#78C850)
  - HP bars: animated width transition, green/yellow/red based on % remaining
  - Battle message box: panel-dark background, cream pixel font

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. **Hook** — 2.5s — The panel widget with red header, POKÉMON BATTLE SIMULATOR, GEN I · II · III
2. **Home Menu** — 3.5s — Four menu rows stagger in beat-by-beat; hover state fires on row 2
3. **Gym Leaders** — 3.5s — Four gym leader cards with type-colored banners reveal beat-by-beat
4. **Battle** — 5.5s — HP bars, move menu, move selected, HP animates down, "It's super effective!"
5. **Stats** — 3s — 57 UNIT TESTS. / GEN III DAMAGE FORMULA. / SEEDED RNG. one-by-one
6. **Outro** — 3s — Full-screen panel-dark + "Fan project — not an official Pokémon product." + music duck + bell

## Audio
- Audio role: Warm upbeat bed with light game-UI SFX matched to the pixel aesthetic.
- Audio arc: Energetic through Scenes 1–4, confident through the stats reveal (Scene 5), then music ducks and one quiet bell closes the punchline (Scene 6).
- Music: `assets/music/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3`
- Music treatment: Start at 0s, volume 0.35 through Scenes 1–5. Fade to 0.10 at Scene 6 start. Let the "fan project" line land over near-silence; hold for 2s then video ends.
- Music cue guidance: Bundled preset JSON at `brag-output/composition/assets/music/cues/happy-beats-business-moves-vol-9-by-ende-dot-app.music-cues.json` (copy it in). Tempo ~114.84 BPM, beat interval ~0.52s. Beat-lock targets: Scene 2 first menu item near 4.23s (strong cue 1.00); gym leader first card near 6.34s (strong cue 1.00); battle HP drain start near 10.54s (strong cue 1.00); first stat line near 12.65s (strong cue 1.00). Sequential reveals (menu rows, gym leader cards): snap first item to the strong cue, subsequent items to beat-grid spacing. For the 3 stat lines: hold each ~0.9s (do NOT snap every 0.52s beat — too fast to read "GEN III DAMAGE FORMULA"). Non-text SFX accents may land on every beat.
- Audio-reactive treatment: Subtle. Use music RMS/bass to make the red panel header glow softly and the panel surface breathe. No waveform or equalizer visuals. No strobing.
- Audio-coupled moments:
  - Scene 2 menu rows → `interface/drop_001.ogg` or `drop_002.ogg` per row arrival
  - Scene 3 gym leader cards → `casino/card-place-2.ogg` or `casino/card-slide-2.ogg` per card
  - Scene 4 move selection → `interface/click_001.ogg` on the highlighted button
  - Scene 4 HP drain → soft `interface/switch_001.ogg` at drain start
  - Scene 5 stat lines → `impact/impactSoft_medium_000.ogg` per line, volume ~0.55
  - Scene 6 text settles → one `interface/bong_001.ogg` at ~0.4s after text visible, volume ~0.50
- SFX selection guidance: Everything should sound like a clean game UI — soft drops, card sounds, light clicks. No punches, no glitches. Pixel aesthetic needs warmth, not hype-reel energy.
- SFX analysis guidance: Use `~/.claude/plugins/cache/brag/brag/0.2.2/skills/brag/assets/sfx/sfx-analysis.md` for file selection. Prefer low HF-risk files for all repeated sounds (drop, card-place) and medium HF for the stat-line impacts.
- Exact SFX choice: Hyperframes should choose final filenames, timestamps, and density based on implemented animation.
- Audio files: copy chosen music and SFX into `brag-output/composition/assets/`.

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project (the panel widget + actual copy).
- Keep all text readable in the final render — the pixel font at small sizes needs full settle time.
- Keep total duration at 21 seconds (±0.5s).
- Include the planned music/SFX layer.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints; Hyperframes decides exact animation timing.
- Beat-lock 1–3 major scene reveals to the strong cues listed above (±0.15s), mark `// beat-locked`.
- Sequential menu rows and gym leader cards: snap to beat-grid (±0.10s), mark `// beat-grid`.
- Stat lines: hold each ~0.9s — do NOT snap to every 0.52s beat.
- Audio-reactive: extract per-frame audio data via `hyperframes-creative` skill workflow. Wire RMS/bass to panel glow and header pulse. If extraction fails, note it and continue.
- Use local assets for all audio (relative paths from `composition/`).
- Run `npx hyperframes check` before render — this is the single gate.
