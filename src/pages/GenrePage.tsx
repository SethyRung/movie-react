import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { SearchResults } from "@/components/search/SearchResults";
import { ErrorState } from "@/components/ErrorState";
import { useMoviesByGenre } from "@/hooks/useDiscovery";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";

const GENRE_MAP: Record<number, string> = {
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

export default function GenrePage() {
  const { genreId } = useParams<{ genreId: string }>();
  const id = Number(genreId);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useMoviesByGenre(id, page);
  const movies = data?.data?.results;
  const totalPages = data?.data?.total_pages ?? 1;

  const genreName = GENRE_MAP[id] || "Genre";

  usePageTitle(`${genreName} Movies`);

  if (isError) {
    return (
      <PageContainer>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">{genreName} Movies</h1>
        <ErrorState message="Failed to load movies." onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">{genreName} Movies</h1>

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
