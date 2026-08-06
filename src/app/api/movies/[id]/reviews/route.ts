import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  rating: z.number().min(0).max(5),
  highs: z.string().optional().default(""),
  lows: z.string().optional().default(""),
  favoriteCharacter: z.string().optional().default(""),
  favoriteActor: z.string().optional().default(""),
  favoriteScene: z.string().optional().default(""),
  quote: z.string().optional().default(""),
  comment: z.string().optional().default(""),
  wouldRewatch: z.boolean().nullable().optional(),
});

// Cria ou atualiza a ficha do usuário logado para esse filme (upsert).
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const userId = (session.user as any).id as string;
  const data = parsed.data;

  const review = await prisma.review.upsert({
    where: { userId_movieId: { userId, movieId: params.id } },
    update: data,
    create: { ...data, userId, movieId: params.id },
  });

  return NextResponse.json({ review });
}
