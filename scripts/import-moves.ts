/**
 * import-moves.ts
 *
 * Imports all moves for Gen I-III (IDs 1-354) from PokéAPI into the Move table.
 *
 * In Gen III, move category is determined by TYPE (not by individual move):
 *   Physical types: Normal, Fighting, Flying, Ground, Rock, Bug, Ghost, Steel, Poison
 *   Special types:  Fire, Water, Grass, Electric, Ice, Psychic, Dragon, Dark
 *   Status: moves whose damage_class is "status"
 *
 * Usage:
 *   npx tsx scripts/import-moves.ts [--dry-run]
 */

import { fileURLToPath } from "url";
import prisma from "@/lib/prisma";
import { fetchWithRetry, withConcurrency } from "./utils";

// ─── PokéAPI response shapes ────────────────────────────────────────────────

interface NamedResource {
  name: string;
  url: string;
}

interface EffectEntry {
  effect: string;
  short_effect: string;
  language: NamedResource;
}

interface MoveResponse {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number;
  priority: number;
  power: number | null;
  damage_class: NamedResource;
  type: NamedResource;
  effect_entries: EffectEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GEN3_MOVE_MAX = 354;
const CONCURRENCY = 10;

/** These types deal Physical damage in Gen III. All others deal Special damage. */
const PHYSICAL_TYPES = new Set([
  "normal",
  "fighting",
  "flying",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "poison",
]);

const dryRun = process.argv.includes("--dry-run");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGen3Category(
  typeName: string,
  damageClass: string
): "physical" | "special" | "status" {
  if (damageClass === "status") return "status";
  return PHYSICAL_TYPES.has(typeName) ? "physical" : "special";
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  console.log(
    `[import-moves] Starting (moves 1-${GEN3_MOVE_MAX})${dryRun ? " (DRY RUN)" : ""}…`
  );

  // Pre-load type name→id map so we can look up typeId by name.
  const types = await prisma.type.findMany();
  const typeNameToId = new Map<string, number>(
    (types as Array<{ id: number; name: string }>).map((t) => [t.name, t.id])
  );

  if (typeNameToId.size === 0) {
    console.warn(
      "[import-moves] Warning: no types found in DB — run import-types first."
    );
  }

  const moveIds = Array.from({ length: GEN3_MOVE_MAX }, (_, i) => i + 1);
  let imported = 0;
  let failed = 0;

  await withConcurrency(moveIds, CONCURRENCY, async (id) => {
    const url = `https://pokeapi.co/api/v2/move/${id}`;
    let move: MoveResponse;

    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      move = (await res.json()) as MoveResponse;
    } catch (err) {
      console.error(`[import-moves] Failed to fetch move ${id}:`, err);
      failed++;
      return;
    }

    const typeId = typeNameToId.get(move.type.name);
    if (typeId === undefined) {
      console.warn(
        `[import-moves] Unknown type "${move.type.name}" for move ${move.name}, skipping.`
      );
      failed++;
      return;
    }

    const category = getGen3Category(move.type.name, move.damage_class.name);
    const effectEntry = move.effect_entries.find(
      (e) => e.language.name === "en"
    );
    const effect = effectEntry?.short_effect ?? null;

    if (dryRun) {
      console.log(
        `[import-moves] [DRY] ${move.name} (${move.type.name}/${category}) pp=${move.pp} power=${move.power}`
      );
      imported++;
      return;
    }

    try {
      await prisma.move.upsert({
        where: { id: move.id },
        update: {
          name: move.name,
          typeId,
          category,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp,
          priority: move.priority,
          effect,
          effectChance: move.effect_chance,
        },
        create: {
          id: move.id,
          name: move.name,
          typeId,
          category,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp,
          priority: move.priority,
          effect,
          effectChance: move.effect_chance,
        },
      });
      imported++;
    } catch (err) {
      console.error(`[import-moves] DB error for move ${move.name}:`, err);
      failed++;
    }
  });

  console.log(
    `[import-moves] Done. Imported: ${imported}, Failed: ${failed}.`
  );
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
