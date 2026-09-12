/**
 * import-evolutions.ts
 *
 * Imports evolution chains for all Gen I-III Pokémon (#1-386).
 *
 * Fetches all species to collect unique evolution_chain URLs, then walks
 * each chain tree recursively, upserting EvolutionStep rows.
 *
 * Usage:
 *   npx tsx scripts/import-evolutions.ts [--dry-run]
 */

import { fileURLToPath } from "url";
import prisma from "@/lib/prisma";
import { extractIdFromUrl, fetchWithRetry, withConcurrency } from "./utils";

// ─── PokéAPI response shapes ────────────────────────────────────────────────

interface NamedResource {
  name: string;
  url: string;
}

interface SpeciesResponse {
  id: number;
  name: string;
  evolution_chain: { url: string };
}

interface EvolutionDetail {
  trigger: NamedResource;
  min_level: number | null;
  item: NamedResource | null;
  gender: number | null;
  held_item: NamedResource | null;
  known_move: NamedResource | null;
  known_move_type: NamedResource | null;
  location: NamedResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedResource | null;
  party_type: NamedResource | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedResource | null;
  turn_upside_down: boolean;
}

interface ChainLink {
  species: NamedResource;
  evolves_to: ChainLink[];
  evolution_details: EvolutionDetail[];
}

interface EvolutionChainResponse {
  id: number;
  chain: ChainLink;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POKEMON_MAX = 386;
const CONCURRENCY = 10;

const dryRun = process.argv.includes("--dry-run");

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface StepData {
  fromId: number;
  toId: number;
  trigger: string;
  minLevel: number | null;
  itemName: string | null;
  condition: string | null;
}

function buildCondition(detail: EvolutionDetail): string | null {
  const parts: string[] = [];
  if (detail.gender !== null) parts.push(`gender:${detail.gender}`);
  if (detail.held_item) parts.push(`held:${detail.held_item.name}`);
  if (detail.known_move) parts.push(`move:${detail.known_move.name}`);
  if (detail.known_move_type)
    parts.push(`move_type:${detail.known_move_type.name}`);
  if (detail.location) parts.push(`location:${detail.location.name}`);
  if (detail.min_affection) parts.push(`affection:${detail.min_affection}`);
  if (detail.min_beauty) parts.push(`beauty:${detail.min_beauty}`);
  if (detail.min_happiness) parts.push(`happiness:${detail.min_happiness}`);
  if (detail.needs_overworld_rain) parts.push("rain");
  if (detail.party_species) parts.push(`party:${detail.party_species.name}`);
  if (detail.party_type) parts.push(`party_type:${detail.party_type.name}`);
  if (detail.relative_physical_stats !== null)
    parts.push(`stats:${detail.relative_physical_stats}`);
  if (detail.time_of_day && detail.time_of_day !== "")
    parts.push(`time:${detail.time_of_day}`);
  if (detail.trade_species) parts.push(`trade:${detail.trade_species.name}`);
  if (detail.turn_upside_down) parts.push("upside_down");
  return parts.length > 0 ? parts.join(",") : null;
}

/**
 * Recursively walk a chain and collect all from→to evolution steps.
 * The evolution_details live on the *destination* node.
 */
function walkChain(link: ChainLink, steps: StepData[]): void {
  for (const next of link.evolves_to) {
    const fromId = extractIdFromUrl(link.species.url);
    const toId = extractIdFromUrl(next.species.url);
    if (fromId === null || toId === null) continue;

    // Skip Pokémon outside Gen I-III range.
    if (fromId > POKEMON_MAX || toId > POKEMON_MAX) continue;

    const detail = next.evolution_details[0] ?? null;

    steps.push({
      fromId,
      toId,
      trigger: detail?.trigger.name ?? "unknown",
      minLevel: detail?.min_level ?? null,
      // item = stone used; held_item = item held during level-up/trade
      itemName:
        detail?.item?.name ?? detail?.held_item?.name ?? null,
      condition: detail ? buildCondition(detail) : null,
    });

    walkChain(next, steps);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  console.log(
    `[import-evolutions] Starting${dryRun ? " (DRY RUN)" : ""}…`
  );

  // 1. Fetch all species to collect unique evolution_chain URLs.
  console.log("[import-evolutions] Fetching species data…");

  const speciesIds = Array.from({ length: POKEMON_MAX }, (_, i) => i + 1);
  const chainUrls = new Set<string>();

  await withConcurrency(speciesIds, CONCURRENCY, async (id) => {
    try {
      const res = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      if (!res.ok) return;
      const species = (await res.json()) as SpeciesResponse;
      chainUrls.add(species.evolution_chain.url);
    } catch (err) {
      console.error(`[import-evolutions] Failed to fetch species ${id}:`, err);
    }
  });

  console.log(
    `[import-evolutions] Found ${chainUrls.size} unique evolution chains.`
  );

  // 2. Fetch and process each chain.
  let totalSteps = 0;
  let failed = 0;

  for (const chainUrl of chainUrls) {
    let chainData: EvolutionChainResponse;

    try {
      const res = await fetchWithRetry(chainUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      chainData = (await res.json()) as EvolutionChainResponse;
    } catch (err) {
      console.error(
        `[import-evolutions] Failed to fetch chain ${chainUrl}:`,
        err
      );
      failed++;
      continue;
    }

    const steps: StepData[] = [];
    walkChain(chainData.chain, steps);

    if (steps.length === 0) continue;

    for (const step of steps) {
      if (dryRun) {
        console.log(
          `  [DRY] ${step.fromId} → ${step.toId} via ${step.trigger}` +
            (step.minLevel ? ` lv${step.minLevel}` : "") +
            (step.itemName ? ` item:${step.itemName}` : "") +
            (step.condition ? ` cond:${step.condition}` : "")
        );
        totalSteps++;
        continue;
      }

      try {
        // Idempotent: delete matching step then recreate.
        const existing = await prisma.evolutionStep.findFirst({
          where: { fromPokemonId: step.fromId, toPokemonId: step.toId },
        });

        if (existing) {
          await prisma.evolutionStep.update({
            where: { id: existing.id },
            data: {
              trigger: step.trigger,
              minLevel: step.minLevel,
              itemName: step.itemName,
              condition: step.condition,
            },
          });
        } else {
          await prisma.evolutionStep.create({
            data: {
              fromPokemonId: step.fromId,
              toPokemonId: step.toId,
              trigger: step.trigger,
              minLevel: step.minLevel,
              itemName: step.itemName,
              condition: step.condition,
            },
          });
        }
        totalSteps++;
      } catch (err) {
        console.error(
          `[import-evolutions] DB error for ${step.fromId}→${step.toId}:`,
          err
        );
        failed++;
      }
    }
  }

  console.log(
    `[import-evolutions] Done. Steps upserted: ${totalSteps}, Failed: ${failed}.`
  );
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
