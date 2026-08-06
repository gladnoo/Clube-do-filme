import MovieDetail from "@/components/MovieDetail";

export const dynamic = "force-dynamic";

export default function MoviePage({ params }: { params: { id: string } }) {
  return <MovieDetail movieId={params.id} />;
}
