import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { reviews: true } },
      reviews: { select: { rating: true } },
    },
  });

  const withAvg = movies.map((m: (typeof movies)[number]) => {
    const { reviews, _count, ...rest } = m;
    const avg =
      reviews.length > 0
        ? reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length
        : null;
    return { ...rest, reviewCount: _count.reviews, avgRating: avg };
  });

  return NextResponse.json({ movies: withAvg });
}

const castSchema = z.object({
  actor: z.string().min(1),
  character: z.string().optional().default(""),
});

const createSchema = z.object({
  title: z.string().trim().min(1, "Informe o título"),
  year: z.number().int().nullable().optional(),
  director: z.string().optional().default(""),
  poster: z.string().optional().default(""),
  synopsis: z.string().optional().default(""),
  weekLabel: z.string().optional().default(""),
  tmdbId: z.number().int().nullable().optional(),
  cast: z.array(castSchema).optional().default([]),
  setAsCurrent: z.boolean().optional().default(false),
  inQueue: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const userId = (session.user as any).id as string;

  const movie = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.setAsCurrent) {
      await tx.movie.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
    }

    return tx.movie.create({
      data: {
        title: data.title,
        year: data.year ?? null,
        director: data.director,
        poster: data.poster,
        synopsis: data.synopsis,
        weekLabel: data.weekLabel,
        tmdbId: data.tmdbId ?? null,
        isCurrent: data.setAsCurrent,
        inQueue: data.setAsCurrent ? false : data.inQueue,
        addedById: userId,
        cast: {
          create: data.cast.map((c) => ({ actor: c.actor, character: c.character ?? "" })),
        },
      },
      include: { cast: true },
    });
  });

  return NextResponse.json({ movie });
}
