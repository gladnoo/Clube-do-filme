"use client";

import { useMemo, useState } from "react";
import { Search, ArrowDownWideNarrow } from "lucide-react";
import MovieCard from "./MovieCard";

type MovieItem = {
  id: string;
  title: string;
  year: number | null;
  poster: string | null;
  avgRating: number | null;
  reviewCount: number;
  isCurrent: boolean;
};

type SortKey = "recent" | "rating" | "title";

export default function HistoryGrid({ movies }: { movies: MovieItem[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [onlyRated, setOnlyRated] = useState(false);

  const filtered = useMemo(() => {
    let list = movies.filter((m) => {
      if (onlyRated && m.reviewCount === 0) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return m.title.toLowerCase().includes(q) || String(m.year ?? "").includes(q);
    });

    if (sort === "rating") {
      list = [...list].sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1));
    } else if (sort === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }
    // "recent" mantém a ordem original (já vem por createdAt desc)

    return list;
  }, [movies, query, sort, onlyRated]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paperalt/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título ou ano..."
            className="w-full font-mono text-sm bg-bgalt border border-white/[0.06] rounded-md pl-10 pr-4 py-2.5 outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div className="relative">
          <ArrowDownWideNarrow className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-paperalt/35 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none font-mono text-xs bg-bgalt border border-white/[0.06] rounded-md pl-8 pr-8 py-2.5 outline-none focus:border-gold/50 text-paperalt/80"
          >
            <option value="recent">Mais recentes</option>
            <option value="rating">Melhor nota</option>
            <option value="title">Ordem alfabética</option>
          </select>
        </div>
        <button
          onClick={() => setOnlyRated((v) => !v)}
          className={`font-mono text-xs px-3.5 py-2.5 rounded-md border transition-colors whitespace-nowrap ${
            onlyRated
              ? "bg-gold/15 border-gold/40 text-gold"
              : "border-white/[0.06] text-paperalt/50 hover:text-paperalt/80"
          }`}
        >
          só com fichas
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-paperalt/50 text-sm py-10 text-center">
          Nenhum filme encontrado pra essa busca.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              year={m.year}
              poster={m.poster}
              avgRating={m.avgRating}
              reviewCount={m.reviewCount}
              isCurrent={m.isCurrent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
