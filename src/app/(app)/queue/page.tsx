import Image from "next/image";
import Link from "next/link";
import { ListPlus, Plus, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SetCurrentButton from "@/components/SetCurrentButton";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const movies = await prisma.movie.findMany({
    where: { inQueue: true, isCurrent: false },
    orderBy: { createdAt: "asc" },
    include: { addedBy: { select: { displayName: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-gold" />
          <h1 className="font-display text-4xl tracking-wide">FILA</h1>
        </div>
        <Link href="/add" className="btn-secondary">
          <Plus className="w-3.5 h-3.5" />
          Adicionar
        </Link>
      </div>
      <p className="font-mono text-xs text-paperalt/40 mb-7">
        Candidatos a próximo filme da semana. Qualquer um do clube pode escolher.
      </p>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20 gap-3">
          <div className="w-14 h-14 rounded-full bg-bgalt border border-white/[0.06] flex items-center justify-center">
            <ListPlus className="w-6 h-6 text-gold" />
          </div>
          <p className="font-mono text-paperalt/50 text-sm">
            A fila tá vazia. Adicione um filme e mande pra fila.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {movies.map((m: (typeof movies)[number]) => (
            <div key={m.id} className="surface flex items-center gap-4 p-3">
              <Link href={`/movie/${m.id}`} className="relative w-14 h-20 rounded-md overflow-hidden shrink-0 bg-bgraised">
                {m.poster ? (
                  <Image src={m.poster} alt={m.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-lg text-line/40">
                    {m.title.slice(0, 1)}
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/movie/${m.id}`} className="font-display text-xl tracking-wide truncate block hover:text-gold transition-colors">
                  {m.title}
                </Link>
                <p className="font-mono text-[11px] text-paperalt/45">{m.year ?? "—"}</p>
                {m.addedBy && (
                  <p className="flex items-center gap-1 font-mono text-[11px] text-paperalt/30 mt-0.5">
                    <UserRound className="w-3 h-3" />
                    {m.addedBy.displayName}
                  </p>
                )}
              </div>
              <SetCurrentButton movieId={m.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
