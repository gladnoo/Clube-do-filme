"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, ImageOff, Download, ListPlus, Star, History } from "lucide-react";
import MovieFieldsEditor, { MovieFormState } from "@/components/MovieFieldsEditor";

type TmdbResult = {
  tmdbId: number;
  title: string;
  year: number | null;
  poster: string | null;
  synopsisPreview: string;
};

type FormState = MovieFormState & { tmdbId: number | null };

const emptyForm: FormState = {
  title: "",
  year: "",
  director: "",
  poster: "",
  synopsis: "",
  weekLabel: "",
  tmdbId: null,
  cast: [{ actor: "", character: "" }],
};

type Destination = "queue" | "current" | "watched";

const DESTINATIONS: { value: Destination; label: string; hint: string; Icon: typeof ListPlus }[] = [
  { value: "queue", label: "Adicionar à fila", hint: "candidato pra uma próxima semana", Icon: ListPlus },
  { value: "current", label: "Filme da semana", hint: "já vira o filme atual do clube", Icon: Star },
  { value: "watched", label: "Já assistido", hint: "só registrar no histórico", Icon: History },
];

export default function AddMoviePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [destination, setDestination] = useState<Destination>("queue");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [importing, setImporting] = useState<number | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setSearchError("");
    const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setSearching(false);
    if (!res.ok) {
      setSearchError(data.error ?? "Não foi possível buscar. Confira sua TMDB_API_KEY no .env.");
      return;
    }
    setResults(data.results);
  }

  async function handleImport(tmdbId: number) {
    setImporting(tmdbId);
    const res = await fetch(`/api/tmdb/movie/${tmdbId}`);
    const data = await res.json();
    setImporting(null);
    if (!res.ok) {
      setSearchError(data.error ?? "Não foi possível importar esse filme.");
      return;
    }
    setForm({
      title: data.title ?? "",
      year: data.year ? String(data.year) : "",
      director: data.director ?? "",
      poster: data.poster ?? "",
      synopsis: data.synopsis ?? "",
      weekLabel: "",
      tmdbId: data.tmdbId,
      cast: data.cast.length > 0 ? data.cast : [{ actor: "", character: "" }],
    });
    setShowForm(true);
  }

  function startManual() {
    setForm(emptyForm);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setSaveError("Informe o título do filme.");
      return;
    }
    setSaving(true);
    setSaveError("");
    const res = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.trim(),
        year: form.year ? Number(form.year) : null,
        director: form.director,
        poster: form.poster,
        synopsis: form.synopsis,
        weekLabel: form.weekLabel,
        tmdbId: form.tmdbId,
        cast: form.cast.filter((c) => c.actor.trim().length > 0),
        setAsCurrent: destination === "current",
        inQueue: destination === "queue",
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setSaveError(data.error ?? "Não foi possível salvar o filme.");
      return;
    }
    router.push(`/movie/${data.movie.id}`);
  }

  if (!showForm) {
    return (
      <div>
        <h1 className="font-display text-4xl tracking-wide mb-1.5">ADICIONAR FILME</h1>
        <p className="font-mono text-xs text-paperalt/40 mb-6">
          Busque no TMDB pra importar pôster, sinopse e elenco automaticamente.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-7">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paperalt/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque um filme..."
              className="w-full font-mono bg-bgalt border border-white/[0.06] rounded-md pl-10 pr-4 py-3 outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <button type="submit" disabled={searching} className="btn-primary px-6">
            {searching ? "..." : "Buscar"}
          </button>
        </form>

        {searchError && <p className="font-mono text-sm text-red-light mb-4">{searchError}</p>}

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {results.map((r) => (
              <div key={r.tmdbId} className="surface overflow-hidden group">
                <div className="relative aspect-[2/3] bg-white/[0.03]">
                  {r.poster ? (
                    <Image src={r.poster} alt={r.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-6 h-6 text-line/30" />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="font-display text-lg leading-tight tracking-wide line-clamp-2">
                    {r.title}
                  </p>
                  <p className="font-mono text-[11px] text-paperalt/40 mb-2.5">{r.year ?? "—"}</p>
                  <button
                    onClick={() => handleImport(r.tmdbId)}
                    disabled={importing === r.tmdbId}
                    className="btn-secondary w-full !py-1.5 !text-[11px]"
                  >
                    <Download className="w-3 h-3" />
                    {importing === r.tmdbId ? "Importando..." : "Importar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={startManual} className="btn-ghost !px-0 underline underline-offset-4 decoration-white/20">
          Não achei o filme — adicionar manualmente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl tracking-wide">
          {form.tmdbId ? "CONFERIR E SALVAR" : "ADICIONAR MANUALMENTE"}
        </h1>
        <button onClick={() => setShowForm(false)} className="btn-ghost">
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar pra busca
        </button>
      </div>

      <form onSubmit={handleSave} className="ficha p-0 overflow-hidden">
        <div className="px-6 md:px-8 py-6 flex flex-col gap-6">
          <MovieFieldsEditor form={form} setForm={setForm as any} />

          <div>
            <label className="field-label mb-2">Pra onde vai esse filme?</label>
            <div className="grid sm:grid-cols-3 gap-2">
              {DESTINATIONS.map((d) => {
                const active = destination === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDestination(d.value)}
                    className={`text-left px-3.5 py-3 rounded-md border transition-colors ${
                      active
                        ? "bg-red/10 border-red text-ink"
                        : "border-ink/15 text-inksoft hover:border-ink/30"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide2">
                      <d.Icon className="w-3.5 h-3.5" />
                      {d.label}
                    </span>
                    <span className="block font-mono text-[11px] text-inksoft/70 mt-0.5">
                      {d.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {saveError && <p className="font-mono text-sm text-red-dark">{saveError}</p>}

          <div className="pt-2 border-t border-ink/10">
            <button type="submit" disabled={saving} className="btn-primary mt-5">
              {saving ? "Salvando..." : "Salvar filme"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
