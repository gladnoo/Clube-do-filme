import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EditMovieForm from "@/components/EditMovieForm";

export const dynamic = "force-dynamic";

export default async function EditMoviePage({ params }: { params: { id: string } }) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
    include: { cast: true },
  });

  if (!movie) {
    return <p className="font-mono text-paperalt/60">Filme não encontrado.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl tracking-wide">EDITAR FILME</h1>
        <Link href={`/movie/${movie.id}`} className="btn-ghost">
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </Link>
      </div>

      <EditMovieForm
        movieId={movie.id}
        initial={{
          title: movie.title,
          year: movie.year ? String(movie.year) : "",
          director: movie.director ?? "",
          poster: movie.poster ?? "",
          synopsis: movie.synopsis ?? "",
          weekLabel: movie.weekLabel ?? "",
          cast:
            movie.cast.length > 0
              ? movie.cast.map((c: (typeof movie.cast)[number]) => ({
                  actor: c.actor,
                  character: c.character,
                }))
              : [{ actor: "", character: "" }],
        }}
      />
    </div>
  );
}
