import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { MovieCard, MovieCardSkeleton } from "@/components/movie/MovieCard";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
} from "@/hooks/useDiscovery";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type SortOption = "popular" | "now_playing" | "upcoming" | "top_rated";

export default function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = (searchParams.get("sort") as SortOption) || "popular";
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

  const handleSortChange = (value: string) => {
    setSearchParams({ sort: value });
    setPage(1);
  };

  const movies = currentQuery.data?.data?.results;
  const totalPages = currentQuery.data?.data?.total_pages ?? 1;
  const isLoading = currentQuery.isLoading;

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Movies</h1>
        <Tabs value={sort} onValueChange={handleSortChange}>
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="now_playing">Now Playing</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

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
