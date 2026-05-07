import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { useCompleteMovieData } from "@/hooks/useMovie";
import { useSimilarMovies, useMovieRecommendations } from "@/hooks/useMovie";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePageTitle } from "@/hooks/usePageTitle";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const { data, isLoading, isError, refetch } = useCompleteMovieData(movieId);
  const similar = useSimilarMovies(movieId);
  const recommendations = useMovieRecommendations(movieId);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const movie = data?.data;
  const isSaved = movie ? isInWatchlist(movie.id) : false;

  usePageTitle(movie?.title || "Movie Details");

  if (isError) {
    return (
      <PageContainer className="min-h-[50vh]">
        <ErrorState message="Failed to load movie details." onRetry={refetch} />
      </PageContainer>
    );
  }

  if (isLoading || !movie) {
    return (
      <div>
        <Skeleton className="w-full h-[50vh]" />
        <PageContainer>
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
        </PageContainer>
      </div>
    );
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;

  return (
    <div>
      <div className="relative w-full h-[50vh] min-h-[350px] max-h-[600px] overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={`${BACKDROP_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <PageContainer className="-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="shrink-0 mx-auto md:mx-0">
            {movie.poster_path ? (
              <img
                src={`${POSTER_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="w-48 md:w-64 rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-48 md:w-64 aspect-[2/3] rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-sm text-muted-foreground italic mt-1">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {year && <Badge variant="outline">{year}</Badge>}
              {movie.runtime && movie.runtime > 0 && (
                <Badge variant="outline">
                  {runtimeHours}h {runtimeMins}m
                </Badge>
              )}
              <Badge variant="secondary">
                <Icon icon="lucide:star" className="w-3 h-3 mr-1" />
                {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()})
              </Badge>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {movie.genres.map((g) => (
                  <Badge key={g.id} variant="outline" className="text-xs">
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{movie.overview}</p>

            <div className="flex items-center gap-3 mt-6">
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  toggleWatchlist({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path ?? null,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date ?? null,
                  })
                }
              >
                <Icon
                  icon={isSaved ? "lucide:bookmark-check" : "lucide:bookmark"}
                  className="w-4 h-4 mr-2"
                />
                {isSaved ? "Saved" : "Watchlist"}
              </Button>
            </div>

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Production
                </h3>
                <p className="text-sm text-foreground">
                  {movie.production_companies.map((c) => c.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Top Cast</h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {movie.credits.cast.slice(0, 12).map((person) => (
                  <div key={person.credit_id} className="flex flex-col items-center w-24 shrink-0">
                    <Avatar className="w-20 h-20 mb-2">
                      {person.profile_path ? (
                        <AvatarImage
                          src={`${PROFILE_BASE}${person.profile_path}`}
                          alt={person.name}
                        />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-medium text-foreground text-center line-clamp-1 w-full">
                      {person.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground text-center line-clamp-1 w-full">
                      {person.character}
                    </p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}

        {movie.videos && movie.videos.results && movie.videos.results.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Videos</h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {movie.videos.results
                  .filter((v) => v.site === "YouTube")
                  .map((video) => (
                    <div key={video.id} className="shrink-0 w-72 md:w-96">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          title={video.name}
                          src={`https://www.youtube.com/embed/${video.key}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">{video.name}</p>
                    </div>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}

        <MovieCarousel
          title="Similar Movies"
          movies={similar.data?.data?.results}
          isLoading={similar.isLoading}
        />

        <MovieCarousel
          title="Recommended"
          movies={recommendations.data?.data?.results}
          isLoading={recommendations.isLoading}
        />
      </PageContainer>
    </div>
  );
}
