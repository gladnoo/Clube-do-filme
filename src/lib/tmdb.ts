const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

function getKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY não configurada. Adicione sua chave no arquivo .env (veja README)."
    );
  }
  return key;
}

export async function searchMovies(query: string) {
  const key = getKey();
  const url = `${TMDB_BASE}/search/movie?api_key=${key}&language=pt-BR&query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar filmes no TMDB");
  const data = await res.json();

  return (data.results ?? []).map((m: any) => ({
    tmdbId: m.id,
    title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : null,
    synopsisPreview: m.overview,
  }));
}

export async function getMovieDetails(tmdbId: number) {
  const key = getKey();
  const url = `${TMDB_BASE}/movie/${tmdbId}?api_key=${key}&language=pt-BR&append_to_response=credits`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar detalhes do filme no TMDB");
  const m = await res.json();

  const director = (m.credits?.crew ?? []).find((c: any) => c.job === "Director");
  const cast = (m.credits?.cast ?? [])
    .slice(0, 10)
    .map((c: any) => ({ actor: c.name, character: c.character || "" }));

  return {
    tmdbId: m.id,
    title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : null,
    synopsis: m.overview ?? "",
    director: director?.name ?? "",
    cast,
  };
}
