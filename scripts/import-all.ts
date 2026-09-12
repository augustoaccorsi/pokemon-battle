/**
 * import-all.ts
 *
 * Orchestrates all PokéAPI import scripts in the correct order:
 *   1. import-types      — 17 Gen I-III types + effectiveness chart
 *   2. import-moves      — moves 1-354 with Gen III category logic
 *   3. import-pokemon    — Pokémon 1-386 with stats, types, moves, abilities
 *   4. import-evolutions — evolution chains
 *   5. import-sprites    — download sprite images to public/sprites/
 *
 * Usage:
 *   npx tsx scripts/import-all.ts [--dry-run]
 */

import prisma from "@/lib/prisma";
import { main as importTypes } from "./import-types";
import { main as importMoves } from "./import-moves";
import { main as importPokemon } from "./import-pokemon";
import { main as importEvolutions } from "./import-evolutions";
import { main as importSprites } from "./import-sprites";

const dryRun = process.argv.includes("--dry-run");

interface Step {
  name: string;
  fn: () => Promise<void>;
}

const steps: Step[] = [
  { name: "Types", fn: importTypes },
  { name: "Moves", fn: importMoves },
  { name: "Pokémon", fn: importPokemon },
  { name: "Evolutions", fn: importEvolutions },
  { name: "Sprites", fn: importSprites },
];

async function main(): Promise<void> {
  console.log(
    `\n${"=".repeat(50)}\n  PokéAPI Full Import${dryRun ? " (DRY RUN)" : ""}\n${"=".repeat(50)}\n`
  );

  const startTime = Date.now();

  for (const step of steps) {
    const stepStart = Date.now();
    console.log(`\n>>> [${step.name}] Starting…`);

    try {
      await step.fn();
      const elapsed = ((Date.now() - stepStart) / 1000).toFixed(1);
      console.log(`<<< [${step.name}] Done in ${elapsed}s`);
    } catch (err) {
      console.error(`<<< [${step.name}] FAILED:`, err);
      // Continue with remaining steps rather than aborting.
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `\n${"=".repeat(50)}\n  Import complete in ${totalElapsed}s\n${"=".repeat(50)}\n`
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
