import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      pokemon: {
        orderBy: { slot: "asc" as const },
        include: {
          pokemon: {
            include: {
              types: {
                orderBy: { slot: "asc" as const },
                include: { type: true },
              },
            },
          },
        },
      },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}
