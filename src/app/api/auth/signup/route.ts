import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  username: z.string().trim().min(3, "Usuário precisa de pelo menos 3 caracteres"),
  displayName: z.string().trim().min(1, "Informe seu nome"),
  password: z.string().min(4, "Senha precisa de pelo menos 4 caracteres"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const username = parsed.data.username.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Esse nome de usuário já existe" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      displayName: parsed.data.displayName,
      passwordHash,
    },
  });

  return NextResponse.json({ id: user.id, username: user.username });
}
