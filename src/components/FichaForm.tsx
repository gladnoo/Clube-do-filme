"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CloudDrizzle,
  UserRound,
  Star as StarIcon,
  Clapperboard,
  Quote,
  MessageSquareText,
  Check,
  X,
  HelpCircle,
  CircleCheck,
  Film,
} from "lucide-react";
import StarRating from "./StarRating";

type Cast = { actor: string; character: string };

type ReviewData = {
  rating: number;
  highs: string;
  lows: string;
  favoriteCharacter: string;
  favoriteActor: string;
  favoriteScene: string;
  quote: string;
  comment: string;
  wouldRewatch: boolean | null;
};

const empty: ReviewData = {
  rating: 0,
  highs: "",
  lows: "",
  favoriteCharacter: "",
  favoriteActor: "",
  favoriteScene: "",
  quote: "",
  comment: "",
  wouldRewatch: null,
};

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="field-label">
      <Icon className="w-3.5 h-3.5" />
      {children}
    </label>
  );
}

export default function FichaForm({
  movieId,
  cast,
  initial,
  onSaved,
}: {
  movieId: string;
  cast: Cast[];
  initial?: Partial<ReviewData> | null;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [data, setData] = useState<ReviewData>({ ...empty, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ReviewData>(key: K, value: ReviewData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (data.rating === 0) {
      setError("Dá pelo menos meia estrela pro filme :)");
      return;
    }
    setError("");
    setSaving(true);
    const res = await fetch(`/api/movies/${movieId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Não foi possível salvar a ficha.");
      return;
    }
    setSaved(true);
    router.refresh();
    onSaved?.();
  }

  const characters = Array.from(new Set(cast.map((c) => c.character).filter(Boolean)));
  const actors = Array.from(new Set(cast.map((c) => c.actor).filter(Boolean)));

  return (
    <form onSubmit={handleSubmit} className="ficha p-0 overflow-hidden">
      {/* Cabeçalho tipo carteirinha/ficha catalográfica */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-ink/10 bg-black/[0.02]">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide2 text-inksoft">
          <Film className="w-3.5 h-3.5" />
          Ficha de avaliação
        </div>
        <p className="font-mono text-[11px] text-inksoft">
          {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>

      <div className="px-6 md:px-8 py-6 flex flex-col gap-7">
        {/* Nota */}
        <div className="flex flex-col items-start gap-2 pb-6 border-b border-ink/10">
          <span className="field-label mb-0">Sua nota</span>
          <StarRating value={data.rating} onChange={(v) => set("rating", v)} size="lg" showLabel />
        </div>

        {/* Pontos altos / baixos */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <SectionLabel icon={Sparkles}>Pontos altos</SectionLabel>
            <textarea
              value={data.highs}
              onChange={(e) => set("highs", e.target.value)}
              rows={3}
              className="field-textarea"
              placeholder="O que mais funcionou..."
            />
          </div>
          <div>
            <SectionLabel icon={CloudDrizzle}>Pontos baixos</SectionLabel>
            <textarea
              value={data.lows}
              onChange={(e) => set("lows", e.target.value)}
              rows={3}
              className="field-textarea"
              placeholder="O que não funcionou..."
            />
          </div>
        </div>

        {/* Personagem / ator preferido */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <SectionLabel icon={UserRound}>Personagem preferido</SectionLabel>
            {characters.length > 0 ? (
              <select
                value={data.favoriteCharacter}
                onChange={(e) => set("favoriteCharacter", e.target.value)}
                className="field-select"
              >
                <option value="">— escolha —</option>
                {characters.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={data.favoriteCharacter}
                onChange={(e) => set("favoriteCharacter", e.target.value)}
                className="field-input"
              />
            )}
          </div>
          <div>
            <SectionLabel icon={StarIcon}>Ator / atriz preferido</SectionLabel>
            {actors.length > 0 ? (
              <select
                value={data.favoriteActor}
                onChange={(e) => set("favoriteActor", e.target.value)}
                className="field-select"
              >
                <option value="">— escolha —</option>
                {actors.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={data.favoriteActor}
                onChange={(e) => set("favoriteActor", e.target.value)}
                className="field-input"
              />
            )}
          </div>
        </div>

        {/* Cena / frase */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <SectionLabel icon={Clapperboard}>Cena favorita</SectionLabel>
            <input
              type="text"
              value={data.favoriteScene}
              onChange={(e) => set("favoriteScene", e.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <SectionLabel icon={Quote}>Frase marcante</SectionLabel>
            <input
              type="text"
              value={data.quote}
              onChange={(e) => set("quote", e.target.value)}
              className="field-input"
            />
          </div>
        </div>

        {/* Comentário */}
        <div>
          <SectionLabel icon={MessageSquareText}>Comentário livre</SectionLabel>
          <textarea
            value={data.comment}
            onChange={(e) => set("comment", e.target.value)}
            rows={4}
            className="field-textarea"
          />
        </div>

        {/* Assistiria de novo */}
        <div>
          <span className="field-label">Assistiria de novo?</span>
          <div className="flex gap-2">
            {[
              { label: "Sim", value: true, Icon: Check },
              { label: "Não", value: false, Icon: X },
              { label: "Talvez", value: null, Icon: HelpCircle },
            ].map((opt) => {
              const active = data.wouldRewatch === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => set("wouldRewatch", opt.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md border font-mono text-xs uppercase tracking-wide2 transition-colors ${
                    active
                      ? "bg-teal text-paper border-teal"
                      : "border-ink/15 text-inksoft hover:border-ink/30"
                  }`}
                >
                  <opt.Icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-red-dark font-mono text-sm">{error}</p>}

        <div className="flex items-center gap-4 pt-5 border-t border-ink/10">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar ficha"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 font-mono text-sm text-teal-dark">
              <CircleCheck className="w-4 h-4" /> Ficha salva
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
