import type { Metadata } from "next";
import { ListPagination } from "@/components/movie/list-pagination";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieGrid } from "@/components/movie/movie-grid";
import { StatusSection } from "@/components/status-section";
import { parseListPage } from "@/lib/discovery-list";
import { genreHref, genreLabel, parseGenreId } from "@/lib/genre";
import { getMoviesByGenre } from "@/services/discovery/queries";

type GenreSearchParams = {
  page?: string | string[];
};

type GenrePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<GenreSearchParams>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { id } = await params;
  const genreId = parseGenreId(id);
  if (genreId == null) return { title: "Genre not found" };
  return { title: `${genreLabel(genreId)} Movies` };
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { id } = await params;
  const genreId = parseGenreId(id);
  if (genreId == null) {
    return (
      <StatusSection
        label="Genre"
        title="Genre not found"
        message="This genre is unavailable or the link is invalid."
      />
    );
  }

  const query = await searchParams;
  const requestedPage = parseListPage(query.page);
  const title = `${genreLabel(genreId)} Movies`;

  const result = await getMoviesByGenre(genreId, requestedPage).then(
    (value) => ({ ok: true as const, value }),
    () => ({ ok: false as const }),
  );

  if (!result.ok) {
    return (
      <StatusSection
        label="Genre"
        title="Could not load movies"
        message="This genre list is unavailable right now. Try again shortly."
      />
    );
  }

  const list = result.value;
  const page = Math.min(Math.max(list.page, 1), Math.max(list.total_pages, 1));
  const movies = list.results;

  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-8 px-6 py-12 md:py-16">
      <header>
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Genre</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl md:leading-none">
          {title}
        </h1>
      </header>

      {movies.length > 0 ? (
        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} className="w-full" />
          ))}
        </MovieGrid>
      ) : (
        <p className="text-muted-foreground text-lg leading-relaxed">
          No movies in this genre right now.
        </p>
      )}

      <ListPagination
        page={page}
        totalPages={list.total_pages}
        hrefForPage={(next) => genreHref(genreId, next)}
      />
    </div>
  );
}
