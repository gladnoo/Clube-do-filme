import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HistoryGrid from "@/components/HistoryGrid";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const movies = await prisma.movie.findMany({
    where: { inQueue: false },
    orderBy: { createdAt: "desc" },
    include: { reviews: { select: { rating: true } } },
  });

  const items = movies.map((m: (typeof movies)[number]) => {
    const avg =
      m.reviews.length > 0
        ? m.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
          m.reviews.length
        : null;
    return {
      id: m.id,
      title: m.title,
      year: m.year,
      poster: m.poster,
      avgRating: avg,
      reviewCount: m.reviews.length,
      isCurrent: m.isCurrent,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-display text-4xl tracking-wide">HISTÓRICO</h1>
          <p className="font-mono text-xs text-paperalt/40 mt-1">
            {items.length} {items.length === 1 ? "filme" : "filmes"} no clube
          </p>
        </div>
        <Link href="/add" className="btn-secondary">
          <Plus className="w-3.5 h-3.5" />
          Adicionar
        </Link>
      </div>

      <HistoryGrid movies={items} />
    </div>
  );
}
