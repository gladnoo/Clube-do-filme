import Image from "next/image";
import Link from "next/link";
import { Trophy, Clapperboard, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ratingColor } from "@/lib/ratingColor";

export const dynamic = "force-dynamic";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function RankingPage() {
  const [movies, users] = await Promise.all([
    prisma.movie.findMany({ include: { reviews: { select: { rating: true } } } }),
    prisma.user.findMany({ include: { reviews: { select: { rating: true } } } }),
  ]);

  type RankedMovie = { id: string; title: string; year: number | null; poster: string | null; avg: number; count: number };
  type RankedUser = { username: string; displayName: string; count: number; avg: number | null };

  const rankedMovies = movies
    .map((m: (typeof movies)[number]) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      poster: m.poster,
      avg: m.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / m.reviews.length,
      count: m.reviews.length,
    }))
    .filter((m: RankedMovie) => m.count > 0)
    .sort((a: RankedMovie, b: RankedMovie) => b.avg - a.avg || b.count - a.count)
    .slice(0, 10);

  const rankedUsers = users
    .map((u: (typeof users)[number]) => ({
      username: u.username,
      displayName: u.displayName,
      count: u.reviews.length,
      avg:
        u.reviews.length > 0
          ? u.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / u.reviews.length
          : null,
    }))
    .filter((u: RankedUser) => u.count > 0)
    .sort((a: RankedUser, b: RankedUser) => b.count - a.count)
    .slice(0, 10);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Trophy className="w-5 h-5 text-gold" />
        <h1 className="font-display text-4xl tracking-wide">RANKING</h1>
      </div>
      <p className="font-mono text-xs text-paperalt/40 mb-8">
        Os filmes mais bem avaliados e quem mais avaliou no clube.
      </p>

      <section className="mb-12">
        <h2 className="font-display text-2xl tracking-wide mb-4">Melhores filmes</h2>
        {rankedMovies.length === 0 ? (
          <p className="font-mono text-paperalt/50 text-sm">
            Ninguém avaliou nenhum filme ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {rankedMovies.map((m: RankedMovie, i: number) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="surface flex items-center gap-4 p-3 transition-colors group"
                style={{ borderLeft: `3px solid ${ratingColor(m.avg)}` }}
              >
                <span className="w-8 text-center font-display text-2xl text-gold shrink-0">
                  {MEDALS[i] ?? i + 1}
                </span>
                <div className="relative w-11 h-16 rounded-md overflow-hidden shrink-0 bg-bgraised">
                  {m.poster ? (
                    <Image src={m.poster} alt={m.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-sm text-line/40">
                      {m.title.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg tracking-wide truncate group-hover:text-gold transition-colors">
                    {m.title}
                  </p>
                  <p className="font-mono text-[11px] text-paperalt/40">
                    {m.year ?? "—"} · {m.count} {m.count === 1 ? "ficha" : "fichas"}
                  </p>
                </div>
                <span
                  className="flex items-center gap-1 font-mono text-sm shrink-0"
                  style={{ color: ratingColor(m.avg) }}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {m.avg.toFixed(1)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-wide mb-4">Membros mais ativos</h2>
        {rankedUsers.length === 0 ? (
          <p className="font-mono text-paperalt/50 text-sm">Ninguém avaliou nada ainda.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {rankedUsers.map((u: RankedUser, i: number) => (
              <Link
                key={u.username}
                href={`/member/${u.username}`}
                className="surface flex items-center gap-4 p-3.5 hover:border-gold/30 transition-colors group"
              >
                <span className="w-8 text-center font-display text-2xl text-gold shrink-0">
                  {MEDALS[i] ?? i + 1}
                </span>
                <span className="w-9 h-9 rounded-full bg-teal/25 border border-teal/40 text-teal-light flex items-center justify-center font-display text-base shrink-0">
                  {u.displayName.slice(0, 1).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg tracking-wide truncate group-hover:text-gold transition-colors">
                    {u.displayName}
                  </p>
                  <p className="font-mono text-[11px] text-paperalt/40">
                    {u.count} {u.count === 1 ? "ficha" : "fichas"}
                  </p>
                </div>
                {u.avg != null && (
                  <span className="flex items-center gap-1 font-mono text-sm text-paperalt/60 shrink-0">
                    <Clapperboard className="w-3.5 h-3.5" />
                    média {u.avg.toFixed(1)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
