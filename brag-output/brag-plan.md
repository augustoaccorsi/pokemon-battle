# Brag Plan: Pokémon Battle Simulator

## What is this app?
A full Gen I–III Pokémon battle simulator running in the browser — with a faithful FireRed/LeafGreen pixel aesthetic, actual Gen III damage formula, 8 gym leaders across 3 difficulty tiers, and 57 battle engine unit tests.

## The angle
This thing is absurdly well-built for a fan project. Not "here's a cute prototype" — it has seeded-RNG replays, status effects, priority moves, and a proper database of 386 Pokémon. The joke is that this is more rigorous than most production apps. The video plays it straight: show the UI, show the numbers, land the "fan project" disclaimer as the punchline.

## Hook (first 2-3 seconds)
The red Game Boy-style panel appears with the pixel font header:  
**POKÉMON**  
**BATTLE SIMULATOR**  
Then small yellow text below: **GEN I · II · III**  
This earns the next 18 seconds because it immediately signals "someone rebuilt a Game Boy game in the browser."

## Key moments (the middle)
- The home screen menu items stagger in one by one: Pokédex / Battle Simulator / Build Your Team / Gym Leaders — each with its emoji and the hover-yellow animation.
- The gym leader grid: type-colored badges (red Rock, blue Water, yellow Electric, green Grass) sliding in card by card.
- The battle screen: two HP bars, Pokémon sprites, four-move menu. A move is "selected" (highlight on button), HP bar drops with the animated fill, "It's super effective!" appears in the battle message panel.

## Outro / punchline
Stats land one by one:  
**57 UNIT TESTS.**  
**GEN III DAMAGE FORMULA.**  
**SEEDED RNG.**  
Then the footer line from the actual app, full-screen, in panel-dark with the cream text — the real disclaimer — as the final beat:  
*"Fan project — not an official Pokémon product."*

## User flow worth showing
1. **Entry** — Home screen menu: four options, staggered entrance, the red Game Boy panel.
2. **Key action** — Gym leader grid → pick a leader → difficulty modal (Normal / Hard / Challenge).
3. **Result** — Battle screen: HP bars animate, move selected, damage dealt, battle message printed.

## Tone
- Preset: `default`
- Creative direction: "A Game Boy game, in your browser, with 57 unit tests"
- Interpretation: Warm and playful pacing — 4–5 scenes with comfortable rhythm. The humor comes from the product's absurd completeness, not from winking at the camera. Typography echoes the pixel font. Transitions are clean crossfades or slides. Nothing aggressive.

## Format: landscape — 1280×720
## Duration: 21 seconds

## Visual identity (from the project)
- Background: `#5A4A3A` (panel-dark, the outer bg)
- Panel surface: `#F8F0D8` (panel-light, the card/dialog bg)
- Accent / header: `#CC0000` (pokemon-red)
- Highlight / hover: `#FFDE00` (pokemon-yellow)
- Text: `#2C1810` (text-primary)
- Text on dark: `#F8F0D8` (text-on-dark)
- Display font: `"Press Start 2P"` (pixel / game-boy font)
- Body font: same — all text in this app uses the pixel font
- Strongest visual element: The panel widget — cream card, 4px red header, `4px solid #8B7355` pixel border, `4px 4px 0 #3A2A1A` hard shadow. Recreate this for scene 1 and the outro.

## Share copy (draft)
Built a Pokémon battle simulator with the actual Gen III damage formula, 8 gym leaders across 3 difficulty tiers, seeded-RNG replays, and 57 unit tests. Fan project.

## Audio direction
- Role: Warm upbeat bed; light game-UI SFX to match the pixel aesthetic.
- Music: `happy-beats-business-moves-vol-9-by-ende-dot-app.mp3` — 114.84 BPM, mid-energy, slightly retro character.
- Music treatment: Start at 0s, volume 0.35. Fade to 0.15 under the outro punchline (scene 6), let the "fan project" line land over near-silence.
- Music cue guidance: Bundled preset at `~/.claude/plugins/cache/brag/brag/0.2.2/skills/brag/assets/music/cues/happy-beats-business-moves-vol-9-by-ende-dot-app.music-cues.json`. Strong cues at **4.23s, 6.34s, 10.54s, 12.65s**. Target: Scene 2 reveal (menu stagger start) near 4.23s; gym leader grid beat near 6.34s; battle HP drop near 10.54s; stats reveal near 12.65s.
- Beat grid for sequential reveals: at ~114.84 BPM beats are ~0.52s apart. Menu items (4 items) → snap first item to 4.23s, subsequent items at beat-grid spacing (~0.52s); same for gym leader cards (4 cards) starting ~6.34s. For text reveals in the stats scene, hold each item ~0.9s after appearance before the next — do not match every beat (too fast to read "GEN III DAMAGE FORMULA").
- Audio-reactive treatment: Subtle. Use music RMS/bass to make the panel surface glow and the red header pulse slightly. No waveform/equalizer visuals.
- SFX posture: Light, game-UI feel. Pixel aesthetic suits soft drops and card sounds.
- Audio-coupled moments:
  - Menu items stagger in → `interface/drop_001–002.ogg` per item
  - Gym leader card reveals → `casino/card-place-1–4.ogg` per card
  - Move selected (battle) → `interface/click_001.ogg`
  - HP bar drains → `interface/switch_001.ogg` soft at transition
  - Stats line lands → `impact/impactSoft_medium_000.ogg` per line, restrained
  - Final "fan project" line → one quiet `interface/bong_001.ogg`
- Restraint rule: No heavy impacts, no glitch SFX, nothing that clashes with the warm pixel aesthetic. Every SFX should feel like a polished game UI sound, not a YouTube hype reel.

---

## Storyboard

### Scene 1 — Hook — 2.5s
The exact panel widget from the app: cream background (`#F8F0D8`), 4px `#8B7355` border, 4px hard shadow. The red header fills first with the ◆◆◆ row, then **POKÉMON BATTLE SIMULATOR** appears in white pixel font with text-shadow, then the yellow **GEN I · II · III** subline. Nothing else. Full-screen centered on the `#5A4A3A` outer bg.
Sequential/interaction: yes — header bar slides down, title types/fades in, then subline fades.
Audio intent: sets the retro game tone immediately.
Audio-coupled idea: each text appearance has a soft `drop_001` or `drop_002` cue.
Music: starts warm, energetic.
Transition mood: clean slide → Scene 2

### Scene 2 — Home Menu — 3.5s
The full home screen panel: red header (same as Scene 1) plus the four menu items staggering in one by one. Each row: icon + uppercase label + description text + ▶ arrow. The hover state fires on "BATTLE SIMULATOR" (background turns yellow, padding shifts) to simulate a selection.
Sequential/interaction: yes — 4 rows appear ~0.52s apart (beat-grid), then hover on row 2 animates.
Audio intent: playful, energetic — each pop-in feels game-like.
Audio-coupled idea: `interface/drop_001` on each menu item arrival; `ui/mouseclick1` or `interface/click_001` when hover lands.
Music: beat 4.23s → first menu item.
Transition mood: clean crossfade → Scene 3

### Scene 3 — Gym Leaders — 3.5s
The gym leaders grid section. Region header "◈ KANTO REGION" in pokemon-red. Four gym leader cards slide in one by one: each with a type-colored banner (Rock brown `#B8A038`, Water blue `#6890F0`, Electric yellow `#F8D030`, Grass green `#78C850`), the leader name, city, and badge. Cards appear with hover-scale as if being browsed.
Sequential/interaction: yes — 4 cards, beat-grid from 6.34s.
Audio intent: browsing / selecting energy.
Audio-coupled idea: `casino/card-place-2.ogg` or `casino/card-slide-2.ogg` per card.
Music: beat 6.34s → first card.
Transition mood: hard cut → Scene 4

### Scene 4 — Battle — 5.5s
The battle screen. Enemy HP bar (Pokémon name, level, animated bar in green) at top-left. Player HP bar (name, level, `currentHp/maxHp`) at bottom-right. Two Pokémon sprite placeholders. The move menu appears: 4 buttons in a 2×2 grid (TACKLE / GROWL / SCRATCH / TAIL WHIP or similar). A button is highlighted (yellow hover state). It's "clicked." The enemy HP bar animates from full to ~60% (smooth motion.div animation). A battle message panel shows: `"It's super effective!"` in the pixel font.
Sequential/interaction: yes — move highlight → click → HP animate → message.
Audio intent: game-battle tension → payoff.
Audio-coupled idea: `interface/click_001` on move select; subtle `interface/switch_001` as HP drains; no SFX on "It's super effective!" — let it read.
Music: beat 10.54s → HP drain starts.
Transition mood: soft crossfade → Scene 5

### Scene 5 — Stats — 3s
Panel-dark background. Three lines appear one at a time (not every beat — hold 0.9s each):
`57 UNIT TESTS.`
`GEN III DAMAGE FORMULA.`
`SEEDED RNG.`
All in cream pixel font, large, centered. Beat 12.65s → first line.
Sequential/interaction: yes — 3 lines, each held ~0.9s before the next, so all three are on screen together at the end.
Audio intent: "this is more rigorous than it has any right to be."
Audio-coupled idea: `impact/impactSoft_medium_000.ogg` per line arrival, quiet.
Music: beat 12.65s → first stat.
Transition mood: slow crossfade → Scene 6

### Scene 6 — Outro — 3s
Full-screen panel in panel-dark (`#5A4A3A`). Panel-light cream text, centered, pixel font, the exact footer copy from the app:
`"Fan project — not an official Pokémon product."`
Small line below: `Pokémon © Nintendo / Game Freak / Creatures Inc.`
Hold. Music fades to near-silence. One quiet `bong_001` as the main line settles.
Sequential/interaction: none.
Audio intent: deadpan punchline — the contrast between the rigorous engine and the disclaimer.
Audio-coupled idea: `interface/bong_001.ogg` one soft bell at ~0.4s after text settles.
Music: fade from 0.35 → 0.10 during this scene.
Transition mood: fade to black.

**Total duration:** 2.5 + 3.5 + 3.5 + 5.5 + 3 + 3 = **21 seconds** ✓

**Music mood for this video:** Upbeat retro — energetic enough to match the pixel aesthetic, relaxed enough not to overshadow the game UI details.
**Audio summary:** Vol-9 bed at 0.35 runs the full video, light game-UI SFX match each beat-synced reveal, then music quietly ducks under the deadpan outro punchline and one soft bell closes it.
