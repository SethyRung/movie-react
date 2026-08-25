"use client";

import { HistoryIcon, SearchXIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { MovieCardMovie } from "@/components/movie/movie-card";
import { ListPagination } from "@/components/movie/list-pagination";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { parseListPage } from "@/lib/discovery-list";
import { searchHref } from "@/lib/search";

type SearchResponse = {
  results: MovieCardMovie[];
  page: number;
  total_pages: number;
  total_results: number;
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() ?? "";
  const urlPage = parseListPage(searchParams.get("page") ?? undefined);
  const { recent, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  const requestKey = urlQuery ? `${urlQuery}:${urlPage}` : "";
  const [inputValue, setInputValue] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [data, setData] = useState<{ key: string; value: SearchResponse } | null>(null);
  const [error, setError] = useState<{ key: string; message: string } | null>(null);
  const debouncedQuery = useDebouncedValue(inputValue.trim(), 300);

  if (prevUrlQuery !== urlQuery) {
    setPrevUrlQuery(urlQuery);
    setInputValue(urlQuery);
  }

  useEffect(() => {
    if (debouncedQuery === urlQuery) return;
    router.replace(searchHref(debouncedQuery, 1));
    if (debouncedQuery) addRecentSearch(debouncedQuery);
  }, [addRecentSearch, debouncedQuery, router, urlQuery]);

  useEffect(() => {
    if (!urlQuery) return;

    const key = `${urlQuery}:${urlPage}`;
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(urlQuery)}&page=${urlPage}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as SearchResponse & { message?: string };
        if (!response.ok) {
          throw new Error(body.message || "Search failed.");
        }
        return body;
      })
      .then((value) => {
        if (controller.signal.aborted) return;
        setData({ key, value });
        setError(null);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setError({
          key,
          message: reason instanceof Error ? reason.message : "Search failed.",
        });
      });

    return () => controller.abort();
  }, [urlPage, urlQuery]);

  function commitSearch(value: string) {
    const next = value.trim();
    setInputValue(next);
    router.replace(searchHref(next, 1));
    if (next) addRecentSearch(next);
  }

  const resolved = data?.key === requestKey ? data.value : null;
  const movies = resolved?.results ?? [];
  const totalPages = resolved?.total_pages ?? 1;
  const totalResults = resolved?.total_results ?? 0;
  const searching = Boolean(urlQuery) && data?.key !== requestKey && error?.key !== requestKey;
  const errorMessage = error?.key === requestKey ? error.message : null;
  const showRecents = !urlQuery && recent.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-8 px-6 py-12 md:py-16">
      <header className="flex flex-col gap-6">
        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Search
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl md:leading-none">
            Search Movies
          </h1>
        </div>
        <SearchBar value={inputValue} onChange={setInputValue} onSubmit={commitSearch} />
      </header>

      {showRecents ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
              Recent
            </h2>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Clear
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <li key={term}>
                <span className="border-border bg-muted/50 inline-flex items-center gap-1 rounded-sm border">
                  <button
                    type="button"
                    onClick={() => commitSearch(term)}
                    className="inline-flex min-h-11 items-center gap-2 px-3 text-sm"
                  >
                    <HistoryIcon className="text-muted-foreground size-3.5" />
                    {term}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${term}`}
                    onClick={() => removeRecentSearch(term)}
                    className="hover:text-destructive inline-flex size-11 items-center justify-center"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {errorMessage ? (
        <p className="text-muted-foreground text-lg leading-relaxed">{errorMessage}</p>
      ) : null}

      {urlQuery && !errorMessage ? (
        <p className="text-muted-foreground text-sm">
          {searching
            ? "Searching..."
            : `${totalResults} result${totalResults === 1 ? "" : "s"} for "${urlQuery}"`}
        </p>
      ) : null}

      {!searching && urlQuery && !errorMessage && movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <SearchXIcon className="text-muted-foreground size-10" />
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            No movies found for &ldquo;{urlQuery}&rdquo;. Try a different search term.
          </p>
        </div>
      ) : null}

      <SearchResults movies={movies} isLoading={searching} />

      {urlQuery && !errorMessage && totalPages > 1 ? (
        <ListPagination
          page={Math.min(Math.max(resolved?.page ?? urlPage, 1), totalPages)}
          totalPages={totalPages}
          hrefForPage={(page) => searchHref(urlQuery, page)}
        />
      ) : null}
    </div>
  );
}
