import type { Metadata } from "next";
import { CategoryTabs } from "@/components/movie/category-tabs";
import { ListPagination } from "@/components/movie/list-pagination";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieGrid } from "@/components/movie/movie-grid";
import { StatusSection } from "@/components/status-section";
import { listKindLabel, moviesListHref, parseListKind, parseListPage } from "@/lib/discovery-list";
import { discoverList } from "@/services/discovery/queries";

type MoviesSearchParams = {
  kind?: string | string[];
  page?: string | string[];
};

type MoviesPageProps = {
  searchParams: Promise<MoviesSearchParams>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: MoviesPageProps): Promise<Metadata> {
  const params = await searchParams;
  return { title: `${listKindLabel(parseListKind(params.kind))} Movies` };
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const kind = parseListKind(params.kind);
  const requestedPage = parseListPage(params.page);
  const title = `${listKindLabel(kind)} Movies`;

  let list;
  try {
    list = await discoverList(kind, requestedPage);
  } catch {
    return (
      <StatusSection
        label="Browse"
        title="Could not load movies"
        message="This discovery list is unavailable right now. Try again shortly."
      />
    );
  }

  const page = Math.min(Math.max(list.page, 1), Math.max(list.total_pages, 1));
  const movies = list.results;

  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-8 px-6 py-12 md:py-16">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Browse
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl md:leading-none">
            {title}
          </h1>
        </div>
        <CategoryTabs value={kind} />
      </header>

      {movies.length > 0 ? (
        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} className="w-full" />
          ))}
        </MovieGrid>
      ) : (
        <p className="text-muted-foreground text-lg leading-relaxed">
          No movies in this list right now.
        </p>
      )}

      <ListPagination
        page={page}
        totalPages={list.total_pages}
        hrefForPage={(next) => moviesListHref(kind, next)}
      />
    </div>
  );
}
