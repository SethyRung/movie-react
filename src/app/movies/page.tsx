import type { Metadata } from "next";
import { CategoryTabs } from "@/components/movie/category-tabs";
import { ListPagination } from "@/components/movie/list-pagination";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieGrid } from "@/components/movie/movie-grid";
import { listKindLabel, parseListKind, parseListPage } from "@/lib/discovery-list";
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

function MoviesUnavailable() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-340 flex-col justify-end px-6 py-18">
      <p className="text-muted-foreground font-mono text-[11px] tracking-[1.1px] uppercase">
        Browse
      </p>
      <h1 className="mt-3 max-w-2xl text-[38px] leading-none font-medium tracking-[-1.5px] md:text-[60px] md:leading-[1.02] md:tracking-[-2.5px]">
        Could not load movies
      </h1>
      <p className="text-muted-foreground mt-6 max-w-md text-[17px] leading-6.75">
        This discovery list is unavailable right now. Try again shortly.
      </p>
    </section>
  );
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
    return <MoviesUnavailable />;
  }

  const page = Math.min(Math.max(list.page, 1), Math.max(list.total_pages, 1));
  const movies = list.results;

  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-8 px-6 py-12 md:py-16">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[1.1px] uppercase">
            Browse
          </p>
          <h1 className="mt-3 text-[32px] leading-[39px] font-medium tracking-[-1.2px] md:text-[38px] md:leading-none md:tracking-[-1.5px]">
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
        <p className="text-muted-foreground text-[17px] leading-[27px]">
          No movies in this list right now.
        </p>
      )}

      <ListPagination kind={kind} page={page} totalPages={list.total_pages} />
    </div>
  );
}
