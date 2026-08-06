"use client";

import Image from "next/image";
import { Film, Calendar, User2, Link as LinkIcon, AlignLeft, Tag, Plus, Trash2, ImageOff } from "lucide-react";

export type CastRow = { actor: string; character: string };

export type MovieFormState = {
  title: string;
  year: string;
  director: string;
  poster: string;
  synopsis: string;
  weekLabel: string;
  cast: CastRow[];
};

export default function MovieFieldsEditor({
  form,
  setForm,
}: {
  form: MovieFormState;
  setForm: React.Dispatch<React.SetStateAction<MovieFormState>>;
}) {
  function updateCastRow(index: number, key: keyof CastRow, value: string) {
    setForm((f) => {
      const cast = [...f.cast];
      cast[index] = { ...cast[index], [key]: value };
      return { ...f, cast };
    });
  }

  function addCastRow() {
    setForm((f) => ({ ...f, cast: [...f.cast, { actor: "", character: "" }] }));
  }

  function removeCastRow(index: number) {
    setForm((f) => ({ ...f, cast: f.cast.filter((_, i) => i !== index) }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-[160px_1fr] gap-6">
        <div className="relative aspect-[2/3] bg-black/5 rounded-md overflow-hidden border border-ink/10">
          {form.poster ? (
            <Image src={form.poster} alt="" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-inksoft/30" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="field-label">
              <Film className="w-3.5 h-3.5" /> Título *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="field-input text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">
                <Calendar className="w-3.5 h-3.5" /> Ano
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">
                <User2 className="w-3.5 h-3.5" /> Diretor
              </label>
              <input
                type="text"
                value={form.director}
                onChange={(e) => setForm((f) => ({ ...f, director: e.target.value }))}
                className="field-input"
              />
            </div>
          </div>
          <div>
            <label className="field-label">
              <LinkIcon className="w-3.5 h-3.5" /> URL do pôster
            </label>
            <input
              type="text"
              value={form.poster}
              onChange={(e) => setForm((f) => ({ ...f, poster: e.target.value }))}
              className="field-input text-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div>
        <label className="field-label">
          <AlignLeft className="w-3.5 h-3.5" /> Sinopse
        </label>
        <textarea
          value={form.synopsis}
          onChange={(e) => setForm((f) => ({ ...f, synopsis: e.target.value }))}
          rows={4}
          className="field-textarea"
        />
      </div>

      <div>
        <label className="field-label">
          <Tag className="w-3.5 h-3.5" /> Rótulo da semana (opcional)
        </label>
        <input
          type="text"
          value={form.weekLabel}
          onChange={(e) => setForm((f) => ({ ...f, weekLabel: e.target.value }))}
          placeholder="ex: Semana 12 — tema terror dos anos 80"
          className="field-input"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="field-label mb-0">Elenco (atores e personagens)</label>
          <button
            type="button"
            onClick={addCastRow}
            className="flex items-center gap-1 font-mono text-[11px] text-teal-dark hover:text-teal"
          >
            <Plus className="w-3 h-3" /> adicionar linha
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {form.cast.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                type="text"
                placeholder="Ator / atriz"
                value={row.actor}
                onChange={(e) => updateCastRow(i, "actor", e.target.value)}
                className="field-input text-sm"
              />
              <input
                type="text"
                placeholder="Personagem"
                value={row.character}
                onChange={(e) => updateCastRow(i, "character", e.target.value)}
                className="field-input text-sm"
              />
              <button
                type="button"
                onClick={() => removeCastRow(i)}
                className="text-red-dark hover:text-red px-2"
                aria-label="remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
