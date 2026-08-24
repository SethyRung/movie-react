import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { SearchResults } from "@/components/search/SearchResults";
import { CategoryTabs, type CategoryOption } from "@/components/movie/CategoryTabs";
import { ErrorState } from "@/components/ErrorState";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
} from "@/hooks/useDiscovery";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const SORT_LABELS: Record<CategoryOption, string> = {
  popular: "Popular",
  now_playing: "Now Playing",
  upcoming: "Upcoming",
  top_rated: "Top Rated",
};

export default function MovieListPage() {
  usePageTitle("Movies");

  const [searchParams, setSearchParams] = useSearchParams();
  const sort = (searchParams.get("sort") as CategoryOption) || "popular";
  const [page, setPage] = useState(1);

  const popular = usePopularMovies(page);
  const nowPlaying = useNowPlayingMovies(page);
  const upcoming = useUpcomingMovies(page);
  const topRated = useTopRatedMovies(page);

  const currentQuery =
    sort === "popular"
      ? popular
      : sort === "now_playing"
        ? nowPlaying
        : sort === "upcoming"
          ? upcoming
          : topRated;

  const handleSortChange = (value: CategoryOption) => {
    setSearchParams({ sort: value });
    setPage(1);
  };

  const movies = currentQuery.data?.results;
  const totalPages = currentQuery.data?.total_pages ?? 1;
  const isLoading = currentQuery.isLoading;
  const isError = currentQuery.isError;

  if (isError) {
    return (
      <PageContainer>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Movies</h1>
        <ErrorState message="Failed to load movies." onRetry={() => currentQuery.refetch()} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {SORT_LABELS[sort]} Movies
        </h1>
        <CategoryTabs value={sort} onChange={handleSortChange} />
      </div>

      <SearchResults movies={movies} isLoading={isLoading} />

      {totalPages > 1 && (
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
