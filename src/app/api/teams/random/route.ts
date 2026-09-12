import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { PokemonListItem, PokemonType } from "@/types";
import type { RandomTeamRequest } from "@/types/pokemon";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as RandomTeamRequest;
  const {
    generations = [],
    fullyEvolved = false,
    allowLegendary = true,
    types = [],
  } = body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (generations.length > 0) {
    where.generation = { in: generations };
  }
  if (fullyEvolved) {
    where.isFullyEvolved = true;
  }
  if (!allowLegendary) {
    where.isLegendary = false;
    where.isMythical = false;
  }
  if (types.length > 0) {
    where.types = { some: { type: { name: { in: types } } } };
  }

  const rawPokemon = await prisma.pokemon.findMany({
    where,
    select: {
      id: true,
      name: true,
      generation: true,
      spritesFront: true,
      types: {
        orderBy: { slot: "asc" as const },
        select: {
          slot: true,
          type: { select: { name: true } },
        },
      },
    },
  });

  if (rawPokemon.length < 6) {
    return NextResponse.json(
      {
        error:
          "Not enough Pokémon match the selected filters (need at least 6)",
      },
      { status: 400 }
    );
  }

  // Fisher-Yates shuffle then take first 6
  const pool = [...rawPokemon];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const pokemon: PokemonListItem[] = pool.slice(0, 6).map((p) => ({
    id: p.id,
    name: p.name,
    generation: p.generation,
    spriteFront: p.spritesFront ?? undefined,
    types: (p.types as Array<{ type: { name: string } }>).map(
      (t) => t.type.name as PokemonType
    ),
  }));

  return NextResponse.json({ pokemon });
}
