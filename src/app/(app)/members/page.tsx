import Link from "next/link";
import { Users, Clapperboard, Star, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { reviews: { select: { rating: true } } },
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Users className="w-5 h-5 text-gold" />
        <h1 className="font-display text-4xl tracking-wide">MEMBROS</h1>
      </div>
      <p className="font-mono text-xs text-paperalt/40 mb-7">
        {users.length} {users.length === 1 ? "sócio" : "sócios"} no clube
      </p>

      <div className="flex flex-col gap-2.5">
        {users.map((u: (typeof users)[number]) => {
          const avg =
            u.reviews.length > 0
              ? u.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
                u.reviews.length
              : null;
          const initial = u.displayName?.slice(0, 1)?.toUpperCase() ?? "?";

          return (
            <Link
              key={u.id}
              href={`/member/${u.username}`}
              className="surface flex items-center justify-between px-4 py-3.5 hover:border-gold/30 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-display text-lg shrink-0">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-xl tracking-wide truncate">{u.displayName}</p>
                  <p className="font-mono text-[11px] text-paperalt/40">@{u.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="flex items-center gap-1.5 font-mono text-xs text-paperalt/60">
                  <Clapperboard className="w-3.5 h-3.5" />
                  {u.reviews.length}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-gold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {avg != null ? avg.toFixed(1) : "—"}
                </span>
                <ChevronRight className="w-4 h-4 text-paperalt/25 group-hover:text-gold transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
