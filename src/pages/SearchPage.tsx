import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { MovieCard, MovieCardSkeleton } from "@/components/movie/MovieCard";
import { useSearchMovies } from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function SearchPage() {
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

  const { data, isLoading } = useSearchMovies(query, page);
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
