"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MovieFieldsEditor, { MovieFormState } from "./MovieFieldsEditor";

export default function EditMovieForm({
  movieId,
  initial,
}: {
  movieId: string;
  initial: MovieFormState;
}) {
  const router = useRouter();
  const [form, setForm] = useState<MovieFormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Informe o título do filme.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(`/api/movies/${movieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        edit: {
          title: form.title.trim(),
          year: form.year ? Number(form.year) : null,
          director: form.director,
          poster: form.poster,
          synopsis: form.synopsis,
          weekLabel: form.weekLabel,
          cast: form.cast.filter((c) => c.actor.trim().length > 0),
        },
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Não foi possível salvar as alterações.");
      return;
    }
    router.push(`/movie/${movieId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="ficha p-0 overflow-hidden">
      <div className="px-6 md:px-8 py-6 flex flex-col gap-6">
        <MovieFieldsEditor form={form} setForm={setForm} />
        {error && <p className="font-mono text-sm text-red-dark">{error}</p>}
        <div className="pt-2 border-t border-ink/10">
          <button type="submit" disabled={saving} className="btn-primary mt-5">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </form>
  );
}
