import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquareText } from "lucide-react";
import { ratingColor } from "@/lib/ratingColor";

export default function MovieCard({
  id,
  title,
  year,
  poster,
  avgRating,
  reviewCount,
  isCurrent,
}: {
  id: string;
  title: string;
  year: number | null;
  poster: string | null;
  avgRating: number | null;
  reviewCount: number;
  isCurrent: boolean;
}) {
  const accent = ratingColor(avgRating);
  const accentSoft = ratingColor(avgRating, 0.5);

  return (
    <Link href={`/movie/${id}`} className="group block">
      <div
        className="relative aspect-[2/3] rounded-card overflow-hidden shadow-card bg-bgalt transition-all duration-200 group-hover:-translate-y-1"
      >
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 45vw, 220px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-4xl text-line/40">
            {title.slice(0, 1)}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90" />

        {/* borda que muda de cor conforme a nota */}
        <div
          className="absolute inset-0 rounded-card transition-all duration-200 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${avgRating != null ? accentSoft : "rgba(255,255,255,0.06)"}` }}
        />
        <div
          className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 2px ${accent}, 0 0 24px -6px ${accent}` }}
        />

        {isCurrent && (
          <span className="badge-current absolute top-2 left-2">
            <Star className="w-2.5 h-2.5 fill-current" /> Semana atual
          </span>
        )}

        {avgRating != null && (
          <span
            className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm font-mono text-[11px] px-2 py-1 rounded-full"
            style={{ color: accent }}
          >
            <Star className="w-3 h-3 fill-current" />
            {avgRating.toFixed(1)}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-display text-xl leading-tight tracking-wide text-paper line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[11px] text-paperalt/70">{year ?? "—"}</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-paperalt/50">
              <MessageSquareText className="w-3 h-3" />
              {reviewCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
