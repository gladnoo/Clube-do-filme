"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteMovieButton({ movieId, title }: { movieId: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/movies/${movieId}`, { method: "DELETE" });
    router.push("/history");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-paperalt/60">Apagar "{title}" e todas as fichas dele?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-light underline underline-offset-4"
        >
          {loading ? "apagando..." : "sim, apagar"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-paperalt/40 underline underline-offset-4">
          cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide2 text-paperalt/40 hover:text-red-light transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Apagar filme
    </button>
  );
}
