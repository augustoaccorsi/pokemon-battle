/**
 * import-types.ts
 *
 * Imports all 17 Gen I-III types and the full type-effectiveness chart
 * from PokéAPI into the Type and TypeEffectiveness tables.
 *
 * Usage:
 *   npx tsx scripts/import-types.ts [--dry-run]
 */

import { fileURLToPath } from "url";
import prisma from "@/lib/prisma";
import { extractIdFromUrl, fetchWithRetry } from "./utils";

// ─── PokéAPI response shapes ────────────────────────────────────────────────

interface NamedResource {
  name: string;
  url: string;
}

interface TypeListResponse {
  count: number;
  results: NamedResource[];
}

interface DamageRelations {
  no_damage_to: NamedResource[];
  half_damage_to: NamedResource[];
  double_damage_to: NamedResource[];
  no_damage_from: NamedResource[];
  half_damage_from: NamedResource[];
  double_damage_from: NamedResource[];
}

interface TypeDetailResponse {
  id: number;
  name: string;
  damage_relations: DamageRelations;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** IDs 1-17 are the 17 Gen I-III types. 18 = fairy; 10001 = unknown; 10002 = shadow. */
const MAX_VALID_TYPE_ID = 17;

const dryRun = process.argv.includes("--dry-run");

// ─── Main ────────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  console.log(
    `[import-types] Starting${dryRun ? " (DRY RUN)" : ""}…`
  );

  // 1. Fetch the full type list and keep only Gen I-III types.
  const listRes = await fetchWithRetry(
    "https://pokeapi.co/api/v2/type?limit=20"
  );
  if (!listRes.ok) {
    throw new Error(`Failed to list types: HTTP ${listRes.status}`);
  }
  const listData = (await listRes.json()) as TypeListResponse;

  const validTypeRefs = listData.results.filter((t) => {
    const id = extractIdFromUrl(t.url);
    return id !== null && id <= MAX_VALID_TYPE_ID;
  });

  console.log(`[import-types] Fetching details for ${validTypeRefs.length} types…`);

  // 2. Fetch details for every valid type.
  const typeDetails: TypeDetailResponse[] = [];
  for (const ref of validTypeRefs) {
    try {
      const res = await fetchWithRetry(ref.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      typeDetails.push((await res.json()) as TypeDetailResponse);
    } catch (err) {
      console.error(`[import-types] Error fetching ${ref.url}:`, err);
    }
  }

  // 3. Upsert Type records.
  for (const t of typeDetails) {
    console.log(`[import-types] Upserting type: ${t.name} (id=${t.id})`);
    if (!dryRun) {
      await prisma.type.upsert({
        where: { id: t.id },
        update: { name: t.name },
        create: { id: t.id, name: t.name },
      });
    }
  }

  // 4. Build the full 17×17 effectiveness chart.
  // Start with 1.0 for every attacker–defender pair, then override.
  const typeNameToId = new Map<string, number>(
    typeDetails.map((t) => [t.name, t.id])
  );

  type EffRow = { attackerId: number; defenderId: number; multiplier: number };
  const effectivenessMap = new Map<string, EffRow>();

  // Initialise all pairs to 1.0
  for (const attacker of typeDetails) {
    for (const defender of typeDetails) {
      const key = `${attacker.id}-${defender.id}`;
      effectivenessMap.set(key, {
        attackerId: attacker.id,
        defenderId: defender.id,
        multiplier: 1.0,
      });
    }
  }

  // Override from damage_relations
  for (const attacker of typeDetails) {
    const setMultiplier = (targets: NamedResource[], value: number) => {
      for (const t of targets) {
        const defenderId = typeNameToId.get(t.name);
        if (defenderId === undefined) continue; // skip non-Gen-III types
        const key = `${attacker.id}-${defenderId}`;
        const row = effectivenessMap.get(key);
        if (row) row.multiplier = value;
      }
    };

    setMultiplier(attacker.damage_relations.double_damage_to, 2.0);
    setMultiplier(attacker.damage_relations.half_damage_to, 0.5);
    setMultiplier(attacker.damage_relations.no_damage_to, 0.0);
  }

  // 5. Upsert TypeEffectiveness rows.
  console.log(
    `[import-types] Upserting ${effectivenessMap.size} type-effectiveness pairs…`
  );

  for (const row of effectivenessMap.values()) {
    if (dryRun) continue;
    try {
      await prisma.typeEffectiveness.upsert({
        where: {
          attackerId_defenderId: {
            attackerId: row.attackerId,
            defenderId: row.defenderId,
          },
        },
        update: { multiplier: row.multiplier },
        create: {
          attackerId: row.attackerId,
          defenderId: row.defenderId,
          multiplier: row.multiplier,
        },
      });
    } catch (err) {
      console.error(
        `[import-types] Error upserting effectiveness ${row.attackerId}→${row.defenderId}:`,
        err
      );
    }
  }

  console.log("[import-types] Done.");
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
