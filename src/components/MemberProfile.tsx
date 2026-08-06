import Link from "next/link";
import { Clapperboard, Star, PlusSquare, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";

export default async function MemberProfile({ username }: { username: string }) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return <p className="font-mono text-paperalt/60">Membro não encontrado.</p>;
  }

  const [reviews, moviesAdded] = await Promise.all([
    prisma.review.findMany({
      where: { userId: user.id },
      include: { movie: { select: { id: true, title: true, poster: true, year: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.movie.count({ where: { addedById: user.id } }),
  ]);

  const avg =
    reviews.length > 0
      ? reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length
      : null;

  const initial = user.displayName?.slice(0, 1)?.toUpperCase() ?? "?";

  const stats = [
    { label: "filmes avaliados", value: reviews.length, Icon: Clapperboard },
    { label: "nota média dada", value: avg != null ? avg.toFixed(1) : "—", Icon: Star },
    { label: "filmes adicionados", value: moviesAdded, Icon: PlusSquare },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-9">
        <span className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-display text-3xl shrink-0">
          {initial}
        </span>
        <div>
          <p className="font-mono text-gold text-xs uppercase tracking-wide3 mb-1">
            Carteirinha de sócio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wide leading-none">
            {user.displayName}
          </h1>
          <p className="font-mono text-sm text-paperalt/40 mt-1">@{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="ficha p-4 sm:p-5 text-center flex flex-col items-center gap-1.5">
            <s.Icon className="w-4 h-4 text-red mb-0.5" />
            <p className="font-display text-3xl sm:text-4xl text-ink leading-none">{s.value}</p>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wide2 text-inksoft">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl tracking-wide mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-red" />
        Fichas de {user.displayName.split(" ")[0]}
      </h2>

      {reviews.length === 0 ? (
        <p className="font-mono text-paperalt/50 text-sm">
          Esse membro ainda não avaliou nenhum filme.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {reviews.map((r: (typeof reviews)[number]) => (
            <Link
              key={r.id}
              href={`/movie/${r.movie.id}`}
              className="surface flex items-center justify-between px-4 py-3.5 hover:border-gold/30 transition-colors group"
            >
              <div className="min-w-0">
                <p className="font-display text-xl tracking-wide truncate">{r.movie.title}</p>
                <p className="font-mono text-[11px] text-paperalt/40">
                  {r.movie.year ?? "—"} · avaliado em{" "}
                  {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StarRating value={r.rating} readOnly size="sm" />
                <ChevronRight className="w-4 h-4 text-paperalt/25 group-hover:text-gold transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
