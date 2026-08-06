import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
    include: {
      cast: true,
      addedBy: { select: { displayName: true } },
      reviews: {
        include: { user: { select: { id: true, displayName: true, username: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!movie) return NextResponse.json({ error: "Filme não encontrado" }, { status: 404 });

  const avgRating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
        movie.reviews.length
      : null;

  return NextResponse.json({ movie, avgRating });
}

const castSchema = z.object({
  actor: z.string().min(1),
  character: z.string().optional().default(""),
});

const editSchema = z.object({
  title: z.string().trim().min(1),
  year: z.number().int().nullable().optional(),
  director: z.string().optional().default(""),
  poster: z.string().optional().default(""),
  synopsis: z.string().optional().default(""),
  weekLabel: z.string().optional().default(""),
  cast: z.array(castSchema).optional().default([]),
});

const patchSchema = z.object({
  setAsCurrent: z.boolean().optional(),
  inQueue: z.boolean().optional(),
  edit: editSchema.optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const data = parsed.data;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.setAsCurrent) {
      await tx.movie.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
      await tx.movie.update({
        where: { id: params.id },
        data: { isCurrent: true, inQueue: false },
      });
    } else if (data.inQueue !== undefined) {
      await tx.movie.update({ where: { id: params.id }, data: { inQueue: data.inQueue } });
    }

    if (data.edit) {
      await tx.castMember.deleteMany({ where: { movieId: params.id } });
      await tx.movie.update({
        where: { id: params.id },
        data: {
          title: data.edit.title,
          year: data.edit.year ?? null,
          director: data.edit.director,
          poster: data.edit.poster,
          synopsis: data.edit.synopsis,
          weekLabel: data.edit.weekLabel,
          cast: {
            create: data.edit.cast.map((c) => ({ actor: c.actor, character: c.character ?? "" })),
          },
        },
      });
    }
  });

  const movie = await prisma.movie.findUnique({ where: { id: params.id }, include: { cast: true } });
  return NextResponse.json({ movie });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await prisma.movie.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
