import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Star, UserRound, Users, Pencil, ListPlus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ratingColor } from "@/lib/ratingColor";
import StarRating from "./StarRating";
import FichaForm from "./FichaForm";
import ReviewCard from "./ReviewCard";
import SetCurrentButton from "./SetCurrentButton";
import DeleteMovieButton from "./DeleteMovieButton";
import ShareFichaButton from "./ShareFichaButton";
import ParallaxPoster from "./ParallaxPoster";

export default async function MovieDetail({ movieId }: { movieId: string }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      cast: true,
      addedBy: { select: { displayName: true } },
      reviews: {
        include: { user: { select: { id: true, displayName: true, username: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!movie) {
    return <p className="font-mono">Filme não encontrado.</p>;
  }

  type MovieReview = (typeof movie.reviews)[number];

  const avgRating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((s: number, r: MovieReview) => s + r.rating, 0) /
        movie.reviews.length
      : null;

  const myReview = movie.reviews.find((r: MovieReview) => r.userId === userId);
  const otherReviews = movie.reviews.filter((r: MovieReview) => r.userId !== userId);
  const myDisplayName = session?.user?.name ?? "";
  const accent = ratingColor(avgRating);
  const accentSoft = ratingColor(avgRating, 0.4);

  return (
    <div className="relative">
      {movie.poster && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <Image
            src={movie.poster}
            alt=""
            fill
            className="object-cover blur-3xl scale-125 opacity-[0.16]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg" />
        </div>
      )}

      <div className="flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row gap-7">
          <div className="w-44 sm:w-56 shrink-0 mx-auto sm:mx-0">
            <div
              className="relative aspect-[2/3] rounded-card shadow-card bg-bgalt"
              style={{ boxShadow: `0 0 0 1px ${avgRating != null ? accentSoft : "rgba(255,255,255,0.06)"}, 0 1px 2px rgba(0,0,0,.3), 0 12px 28px -8px rgba(0,0,0,.55)` }}
            >
              {movie.poster ? (
                <ParallaxPoster>
                  <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                </ParallaxPoster>
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-5xl text-line/40 rounded-card overflow-hidden">
                  {movie.title.slice(0, 1)}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3.5 min-w-0">
            <div>
              {movie.weekLabel && (
                <p className="font-mono text-gold text-xs uppercase tracking-wide3 mb-1">
                  {movie.weekLabel}
                </p>
              )}
              <h1 className="font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
                {movie.title}
              </h1>
              <p className="font-mono text-sm text-paperalt/55 mt-1.5">
                {movie.year ?? "—"} {movie.director ? `· dirigido por ${movie.director}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StarRating value={avgRating ?? 0} readOnly />
              <span className="flex items-center gap-1.5 font-mono text-xs text-paperalt/45">
                {avgRating != null && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                )}
                média de {movie.reviews.length} {movie.reviews.length === 1 ? "ficha" : "fichas"}
              </span>
            </div>

            {movie.synopsis && (
              <p className="text-paperalt/80 leading-relaxed max-w-2xl text-[15px]">
                {movie.synopsis}
              </p>
            )}

            {movie.cast.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {movie.cast.map((c: (typeof movie.cast)[number]) => (
                  <span key={c.id} className="chip">
                    {c.character ? `${c.character} — ${c.actor}` : c.actor}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center flex-wrap gap-3 mt-2">
              {!movie.isCurrent && <SetCurrentButton movieId={movie.id} />}
              {movie.isCurrent && (
                <span className="badge-current">
                  <Star className="w-2.5 h-2.5 fill-current" /> Filme da semana atual
                </span>
              )}
              {movie.inQueue && !movie.isCurrent && (
                <span className="chip flex items-center gap-1.5 !text-gold">
                  <ListPlus className="w-3 h-3" /> Na fila
                </span>
              )}
              <Link href={`/movie/${movie.id}/edit`} className="btn-ghost">
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Link>
              <DeleteMovieButton movieId={movie.id} title={movie.title} />
            </div>
            {movie.addedBy && (
              <p className="flex items-center gap-1.5 font-mono text-[11px] text-paperalt/35">
                <UserRound className="w-3 h-3" />
                adicionado por {movie.addedBy.displayName}
              </p>
            )}
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="font-display text-2xl tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red" />
              {myReview ? "Sua ficha" : "Preencha sua ficha"}
            </h2>
            {myReview && (
              <ShareFichaButton
                data={{
                  movieTitle: movie.title,
                  movieYear: movie.year,
                  poster: movie.poster,
                  rating: myReview.rating,
                  highs: myReview.highs,
                  comment: myReview.comment,
                  quote: myReview.quote,
                  displayName: myDisplayName,
                }}
              />
            )}
          </div>
          <FichaForm
            movieId={movie.id}
            cast={movie.cast}
            initial={
              myReview
                ? {
                    rating: myReview.rating,
                    highs: myReview.highs ?? "",
                    lows: myReview.lows ?? "",
                    favoriteCharacter: myReview.favoriteCharacter ?? "",
                    favoriteActor: myReview.favoriteActor ?? "",
                    favoriteScene: myReview.favoriteScene ?? "",
                    quote: myReview.quote ?? "",
                    comment: myReview.comment ?? "",
                    wouldRewatch: myReview.wouldRewatch ?? null,
                  }
                : null
            }
          />
        </section>

        {otherReviews.length > 0 && (
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-light" />
              Fichas do clube
              <span className="font-mono text-xs text-paperalt/40 font-normal tracking-normal">
                ({otherReviews.length})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {otherReviews.map((r: MovieReview) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
