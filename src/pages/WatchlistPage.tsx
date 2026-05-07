import { Link } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { MovieCard } from "@/components/movie/MovieCard";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function WatchlistPage() {
  usePageTitle("My Watchlist");

  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <PageContainer>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icon icon="lucide:bookmark" className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">Your watchlist is empty</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Save movies you want to watch later by clicking the bookmark button on any movie page.
          </p>
          <Button asChild>
            <Link to="/movies">Browse Movies</Link>
          </Button>
        </div>
      ) : (
        <MovieGrid>
          {watchlist.map((item) => (
            <div key={item.id} className="relative group">
              <MovieCard
                movie={{
                  id: item.id,
                  title: item.title,
                  poster_path: item.poster_path,
                  vote_average: item.vote_average,
                  release_date: item.release_date,
                  adult: false,
                  original_language: "",
                  original_title: item.title,
                  popularity: 0,
                  video: false,
                  vote_count: 0,
                  genre_ids: [],
                  overview: "",
                  backdrop_path: null,
                }}
              />
              <Button
                variant="destructive"
                size="icon-xs"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromWatchlist(item.id);
                }}
              >
                <Icon icon="lucide:x" className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </MovieGrid>
      )}
    </PageContainer>
  );
}
