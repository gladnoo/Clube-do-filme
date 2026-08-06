import Link from "next/link";
import { Film, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import MovieDetail from "@/components/MovieDetail";

export const dynamic = "force-dynamic";

export default async function WeekPage() {
  const current = await prisma.movie.findFirst({ where: { isCurrent: true } });

  if (!current) {
    return (
      <div className="flex flex-col items-center text-center py-24 gap-4">
        <div className="w-14 h-14 rounded-full bg-bgalt border border-white/[0.06] flex items-center justify-center">
          <Film className="w-6 h-6 text-gold" />
        </div>
        <div>
          <p className="font-display text-3xl tracking-wide text-paper mb-1.5">
            Nenhum filme da semana ainda
          </p>
          <p className="font-mono text-sm text-paperalt/50">
            Adicione um filme e defina como o filme da semana pra começar.
          </p>
        </div>
        <Link href="/add" className="btn-primary mt-2">
          <Plus className="w-4 h-4" />
          Adicionar filme
        </Link>
      </div>
    );
  }

  return <MovieDetail movieId={current.id} />;
}
