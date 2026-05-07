import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { MovieCard, MovieCardSkeleton } from "@/components/movie/MovieCard";
import { ErrorState } from "@/components/ErrorState";
import { useSearchMovies } from "@/hooks/useSearch";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function SearchPage() {
  usePageTitle("Search");

  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setInputValue(urlQuery);
    setQuery(urlQuery);
    setPage(1);
  }, [urlQuery]);

  const { data, isLoading, isError, refetch } = useSearchMovies(query, page);
  const movies = data?.data?.results;
  const totalPages = data?.data?.total_pages ?? 1;
  const totalResults = data?.data?.total_results ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
      setQuery(inputValue.trim());
      setPage(1);
    }
  };

  if (isError) {
    return (
      <PageContainer>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Search Movies</h1>
        <ErrorState message="Failed to load search results." onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Search Movies</h1>

      <form onSubmit={handleSearch} className="relative w-full max-w-xl mb-6">
        <Icon
          icon="lucide:search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
        <Input
          type="search"
          placeholder="Search for movies..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 pr-4 h-10"
        />
      </form>

      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          {isLoading
            ? "Searching..."
            : `${totalResults.toLocaleString()} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {!isLoading && query && movies?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icon icon="lucide:search-x" className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            No movies found for "{query}". Try a different search term.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {query && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
          >
            <Icon icon="lucide:chevron-left" className="w-4 h-4 mr-1" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Next
            <Icon icon="lucide:chevron-right" className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
