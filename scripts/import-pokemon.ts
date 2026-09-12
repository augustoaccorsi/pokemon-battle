/**
 * import-pokemon.ts
 *
 * Imports Pokémon #1-386 from PokéAPI into:
 *   Pokemon, PokemonType, PokemonMove, PokemonAbility, Ability
 *
 * Sprite URLs use Generation III FireRed/LeafGreen sprites.
 * isFullyEvolved is determined by checking the evolution chain.
 *
 * Usage:
 *   npx tsx scripts/import-pokemon.ts [--dry-run]
 */

import { fileURLToPath } from "url";
import prisma from "@/lib/prisma";
import { extractIdFromUrl, fetchWithRetry, withConcurrency } from "./utils";

// ─── PokéAPI response shapes ────────────────────────────────────────────────

interface NamedResource {
  name: string;
  url: string;
}

interface PokemonStat {
  base_stat: number;
  stat: NamedResource;
}

interface ApiPokemonType {
  slot: number;
  type: NamedResource;
}

interface ApiPokemonAbility {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: NamedResource;
  version_group: NamedResource;
}

interface PokemonMoveEntry {
  move: NamedResource;
  version_group_details: VersionGroupDetail[];
}

interface Gen3Sprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
}

interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  versions?: {
    "generation-iii"?: {
      "firered-leafgreen"?: Gen3Sprites;
    };
  };
}

interface PokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: PokemonStat[];
  types: ApiPokemonType[];
  abilities: ApiPokemonAbility[];
  moves: PokemonMoveEntry[];
  sprites: PokemonSprites;
}

interface SpeciesResponse {
  id: number;
  name: string;
  is_legendary: boolean;
  is_mythical: boolean;
  generation: NamedResource;
  evolution_chain: { url: string };
}

interface ChainLink {
  species: NamedResource;
  evolves_to: ChainLink[];
}

interface EvolutionChainResponse {
  id: number;
  chain: ChainLink;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POKEMON_MAX = 386;
const CONCURRENCY = 5;
const GEN3_VERSION_GROUPS = new Set([
  "ruby-sapphire",
  "emerald",
  "firered-leafgreen",
]);
const GEN3_MOVE_MAX = 354;

const dryRun = process.argv.includes("--dry-run");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGeneration(genName: string): number {
  const romanToNum: Record<string, number> = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
    ix: 9,
  };
  const match = genName.match(/generation-([ivx]+)/);
  return match ? (romanToNum[match[1]] ?? 1) : 1;
}

function findInChain(chain: ChainLink, speciesName: string): ChainLink | null {
  if (chain.species.name === speciesName) return chain;
  for (const next of chain.evolves_to) {
    const found = findInChain(next, speciesName);
    if (found) return found;
  }
  return null;
}

function getStat(stats: PokemonStat[], statName: string): number {
  return stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  console.log(
    `[import-pokemon] Starting (Pokémon 1-${POKEMON_MAX})${dryRun ? " (DRY RUN)" : ""}…`
  );

  // Pre-load type name→id for fast lookups.
  const types = await prisma.type.findMany();
  const typeNameToId = new Map<string, number>(
    (types as Array<{ id: number; name: string }>).map((t) => [t.name, t.id])
  );

  // Cache evolution chains to avoid redundant fetches.
  const chainCache = new Map<string, EvolutionChainResponse>();

  const ids = Array.from({ length: POKEMON_MAX }, (_, i) => i + 1);

  await withConcurrency(ids, CONCURRENCY, async (id, i) => {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    let pokemon: PokemonResponse;
    let species: SpeciesResponse;

    try {
      const [pokeRes, specRes] = await Promise.all([
        fetchWithRetry(pokemonUrl),
        fetchWithRetry(speciesUrl),
      ]);
      if (!pokeRes.ok) throw new Error(`pokemon HTTP ${pokeRes.status}`);
      if (!specRes.ok) throw new Error(`species HTTP ${specRes.status}`);
      [pokemon, species] = await Promise.all([
        pokeRes.json() as Promise<PokemonResponse>,
        specRes.json() as Promise<SpeciesResponse>,
      ]);
    } catch (err) {
      console.error(`[import-pokemon] Failed to fetch #${id}:`, err);
      return;
    }

    console.log(`[${i + 1}/${POKEMON_MAX}] Importing ${pokemon.name}…`);

    // ── Determine isFullyEvolved ──────────────────────────────────────────
    let isFullyEvolved = true;
    try {
      const chainUrl = species.evolution_chain.url;
      let chainData = chainCache.get(chainUrl);
      if (!chainData) {
        const chainRes = await fetchWithRetry(chainUrl);
        if (chainRes.ok) {
          chainData = (await chainRes.json()) as EvolutionChainResponse;
          chainCache.set(chainUrl, chainData);
        }
      }
      if (chainData) {
        const node = findInChain(chainData.chain, pokemon.name);
        isFullyEvolved = node !== null && node.evolves_to.length === 0;
      }
    } catch {
      // If chain fetch fails, default to true (safe fallback).
    }

    // ── Sprite URLs (Gen III FireRed/LeafGreen) ───────────────────────────
    const gen3 =
      pokemon.sprites.versions?.["generation-iii"]?.["firered-leafgreen"];
    const spritesFront = gen3?.front_default ?? null;
    const spritesBack = gen3?.back_default ?? null;
    const spritesFrontShiny = gen3?.front_shiny ?? null;
    const spritesBackShiny = gen3?.back_shiny ?? null;

    const generation = parseGeneration(species.generation.name);

    if (dryRun) {
      console.log(
        `  [DRY] ${pokemon.name} gen=${generation} legendary=${species.is_legendary} ` +
          `fullyEvolved=${isFullyEvolved} sprite=${spritesFront ?? "none"}`
      );
      return;
    }

    // ── Upsert Pokémon ────────────────────────────────────────────────────
    try {
      await prisma.pokemon.upsert({
        where: { id: pokemon.id },
        update: {
          name: pokemon.name,
          generation,
          isLegendary: species.is_legendary,
          isMythical: species.is_mythical,
          isFullyEvolved,
          height: pokemon.height,
          weight: pokemon.weight,
          hp: getStat(pokemon.stats, "hp"),
          attack: getStat(pokemon.stats, "attack"),
          defense: getStat(pokemon.stats, "defense"),
          spAttack: getStat(pokemon.stats, "special-attack"),
          spDefense: getStat(pokemon.stats, "special-defense"),
          speed: getStat(pokemon.stats, "speed"),
          spritesFront,
          spritesBack,
          spritesFrontShiny,
          spritesBackShiny,
        },
        create: {
          id: pokemon.id,
          name: pokemon.name,
          generation,
          isLegendary: species.is_legendary,
          isMythical: species.is_mythical,
          isFullyEvolved,
          height: pokemon.height,
          weight: pokemon.weight,
          hp: getStat(pokemon.stats, "hp"),
          attack: getStat(pokemon.stats, "attack"),
          defense: getStat(pokemon.stats, "defense"),
          spAttack: getStat(pokemon.stats, "special-attack"),
          spDefense: getStat(pokemon.stats, "special-defense"),
          speed: getStat(pokemon.stats, "speed"),
          spritesFront,
          spritesBack,
          spritesFrontShiny,
          spritesBackShiny,
        },
      });
    } catch (err) {
      console.error(`[import-pokemon] DB error upserting ${pokemon.name}:`, err);
      return;
    }

    // ── Upsert Types ──────────────────────────────────────────────────────
    for (const typeEntry of pokemon.types) {
      const typeId = typeNameToId.get(typeEntry.type.name);
      if (typeId === undefined) {
        console.warn(
          `  Skipping unknown type "${typeEntry.type.name}" for ${pokemon.name}`
        );
        continue;
      }
      try {
        await prisma.pokemonType.upsert({
          where: {
            pokemonId_slot: { pokemonId: pokemon.id, slot: typeEntry.slot },
          },
          update: { typeId },
          create: { pokemonId: pokemon.id, typeId, slot: typeEntry.slot },
        });
      } catch (err) {
        console.error(
          `  PokemonType error for ${pokemon.name} slot ${typeEntry.slot}:`,
          err
        );
      }
    }

    // ── Upsert Abilities (Ability table first, then junction) ─────────────
    for (const abilityEntry of pokemon.abilities) {
      const abilityId = extractIdFromUrl(abilityEntry.ability.url);
      if (abilityId === null) continue;

      try {
        await prisma.ability.upsert({
          where: { id: abilityId },
          update: {},
          create: {
            id: abilityId,
            name: abilityEntry.ability.name,
            description: null,
          },
        });
        await prisma.pokemonAbility.upsert({
          where: {
            pokemonId_slot: {
              pokemonId: pokemon.id,
              slot: abilityEntry.slot,
            },
          },
          update: { abilityId, isHidden: abilityEntry.is_hidden },
          create: {
            pokemonId: pokemon.id,
            abilityId,
            slot: abilityEntry.slot,
            isHidden: abilityEntry.is_hidden,
          },
        });
      } catch (err) {
        console.error(
          `  Ability error for ${pokemon.name} ability ${abilityEntry.ability.name}:`,
          err
        );
      }
    }

    // ── Upsert Moves (Gen III version groups only, moves 1-354) ──────────
    // Build unique (moveId, learnMethod) pairs.
    const seenMoveKeys = new Set<string>();
    const movesToInsert: {
      moveId: number;
      learnMethod: string;
      levelLearnedAt: number | null;
    }[] = [];

    for (const moveEntry of pokemon.moves) {
      const moveId = extractIdFromUrl(moveEntry.move.url);
      if (moveId === null || moveId > GEN3_MOVE_MAX) continue;

      for (const detail of moveEntry.version_group_details) {
        if (!GEN3_VERSION_GROUPS.has(detail.version_group.name)) continue;

        const key = `${moveId}|${detail.move_learn_method.name}`;
        if (seenMoveKeys.has(key)) continue;
        seenMoveKeys.add(key);

        movesToInsert.push({
          moveId,
          learnMethod: detail.move_learn_method.name,
          levelLearnedAt:
            detail.level_learned_at > 0 ? detail.level_learned_at : null,
        });
      }
    }

    for (const m of movesToInsert) {
      try {
        await prisma.pokemonMove.upsert({
          where: {
            pokemonId_moveId_learnMethod: {
              pokemonId: pokemon.id,
              moveId: m.moveId,
              learnMethod: m.learnMethod,
            },
          },
          update: { levelLearnedAt: m.levelLearnedAt },
          create: {
            pokemonId: pokemon.id,
            moveId: m.moveId,
            learnMethod: m.learnMethod,
            levelLearnedAt: m.levelLearnedAt,
          },
        });
      } catch {
        // Move may not exist in DB if its import failed; skip silently.
      }
    }
  });

  console.log("[import-pokemon] Done.");
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
