/**
 * import-sprites.ts
 *
 * Downloads sprite images for all Pokémon from the URLs stored in the DB
 * and saves them to public/sprites/pokemon/{padded-id}/.
 *
 * Files written:
 *   front.png       ← spritesFront
 *   back.png        ← spritesBack
 *   front_shiny.png ← spritesFrontShiny
 *   back_shiny.png  ← spritesBackShiny
 *
 * Skips files that already exist. Safe to re-run.
 *
 * Usage:
 *   npx tsx scripts/import-sprites.ts [--dry-run]
 */

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { withConcurrency } from "./utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PokemonRow {
  id: number;
  name: string;
  spritesFront: string | null;
  spritesBack: string | null;
  spritesFrontShiny: string | null;
  spritesBackShiny: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONCURRENCY = 10;
const SPRITES_ROOT = path.resolve("public", "sprites", "pokemon");

const dryRun = process.argv.includes("--dry-run");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function padId(id: number): string {
  return id.toString().padStart(3, "0");
}

async function downloadSprite(url: string, destPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

interface SpriteTarget {
  url: string;
  filename: string;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  console.log(
    `[import-sprites] Starting${dryRun ? " (DRY RUN)" : ""}…`
  );

  // Read all Pokémon sprite URLs from DB.
  const allPokemon = (await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      spritesFront: true,
      spritesBack: true,
      spritesFrontShiny: true,
      spritesBackShiny: true,
    },
    orderBy: { id: "asc" },
  })) as PokemonRow[];

  console.log(
    `[import-sprites] Found ${allPokemon.length} Pokémon in DB.`
  );

  if (!dryRun) {
    fs.mkdirSync(SPRITES_ROOT, { recursive: true });
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  await withConcurrency(allPokemon, CONCURRENCY, async (poke) => {
    const dir = path.join(SPRITES_ROOT, padId(poke.id));
    const sprites: SpriteTarget[] = [
      { url: poke.spritesFront ?? "", filename: "front.png" },
      { url: poke.spritesBack ?? "", filename: "back.png" },
      { url: poke.spritesFrontShiny ?? "", filename: "front_shiny.png" },
      { url: poke.spritesBackShiny ?? "", filename: "back_shiny.png" },
    ].filter((s) => s.url !== "");

    if (sprites.length === 0) {
      console.log(`  [${poke.name}] No sprite URLs, skipping.`);
      return;
    }

    if (!dryRun) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const sprite of sprites) {
      const destPath = path.join(dir, sprite.filename);

      if (!dryRun && fs.existsSync(destPath)) {
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(
          `  [DRY] ${poke.name} → ${path.relative("public", destPath)}`
        );
        downloaded++;
        continue;
      }

      try {
        await downloadSprite(sprite.url, destPath);
        downloaded++;
      } catch (err) {
        console.error(
          `  Failed to download ${sprite.url} for ${poke.name}:`,
          err
        );
        failed++;
      }
    }
  });

  console.log(
    `[import-sprites] Done. Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}.`
  );
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
