import Link from "next/link";
import { Sparkles, CloudDrizzle, UserRound, Star as StarIcon, Clapperboard, Quote } from "lucide-react";
import StarRating from "./StarRating";

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold/80" />
      <span>
        <span className="text-paperalt/50">{label}: </span>
        {children}
      </span>
    </p>
  );
}

export default function ReviewCard({ review }: { review: any }) {
  const initial = review.user.displayName?.slice(0, 1)?.toUpperCase() ?? "?";

  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Link href={`/member/${review.user.username}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <span className="w-8 h-8 rounded-full bg-teal/25 border border-teal/40 text-teal-light flex items-center justify-center font-display text-base">
              {initial}
            </span>
            <p className="font-display text-lg tracking-wide leading-none">
              {review.user.displayName}
            </p>
          </Link>
        </div>
        <p className="font-mono text-[11px] text-paperalt/40">
          {new Date(review.createdAt).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <StarRating value={review.rating} readOnly size="sm" />

      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 font-mono text-[13px] text-paperalt/80">
        {review.highs && (
          <Field icon={Sparkles} label="Pontos altos">
            {review.highs}
          </Field>
        )}
        {review.lows && (
          <Field icon={CloudDrizzle} label="Pontos baixos">
            {review.lows}
          </Field>
        )}
        {review.favoriteCharacter && (
          <Field icon={UserRound} label="Personagem">
            {review.favoriteCharacter}
          </Field>
        )}
        {review.favoriteActor && (
          <Field icon={StarIcon} label="Ator">
            {review.favoriteActor}
          </Field>
        )}
        {review.favoriteScene && (
          <Field icon={Clapperboard} label="Cena favorita">
            {review.favoriteScene}
          </Field>
        )}
        {review.quote && (
          <Field icon={Quote} label="Frase">
            “{review.quote}”
          </Field>
        )}
      </div>

      {review.comment && (
        <p className="font-mono text-[13px] text-paperalt/90 mt-3 border-t border-white/[0.06] pt-3 leading-relaxed">
          {review.comment}
        </p>
      )}

      {review.wouldRewatch !== null && review.wouldRewatch !== undefined && (
        <p className="font-mono text-[11px] text-paperalt/40 mt-2">
          Assistiria de novo: {review.wouldRewatch ? "sim" : "não"}
        </p>
      )}
    </div>
  );
}
