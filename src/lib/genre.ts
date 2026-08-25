export const GENRE_NAMES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function parseGenreId(id: string): number | null {
  if (!/^\d+$/.test(id)) return null;
  const genreId = Number(id);
  return Number.isInteger(genreId) && genreId > 0 ? genreId : null;
}

export function genreLabel(genreId: number): string {
  return GENRE_NAMES[genreId] ?? "Genre";
}

export function genreHref(genreId: number, page = 1): string {
  return page > 1 ? `/genre/${genreId}?page=${page}` : `/genre/${genreId}`;
}
