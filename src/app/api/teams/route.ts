import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { SaveTeamRequest } from "@/types/pokemon";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as SaveTeamRequest;
  const { name, pokemonIds } = body;

  if (!Array.isArray(pokemonIds) || pokemonIds.length !== 6) {
    return NextResponse.json(
      { error: "Team must have exactly 6 Pokémon" },
      { status: 400 }
    );
  }

  if (pokemonIds.some((id) => typeof id !== "number" || !Number.isInteger(id))) {
    return NextResponse.json(
      { error: "All pokemonIds must be integers" },
      { status: 400 }
    );
  }

  const team = await prisma.team.create({
    data: {
      name: name ?? null,
      pokemon: {
        create: pokemonIds.map((pokemonId, slot) => ({ pokemonId, slot })),
      },
    },
  });

  return NextResponse.json({ teamId: team.id }, { status: 201 });
}
