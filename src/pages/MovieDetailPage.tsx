import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { CastList } from "@/components/movie/CastList";
import { VideoList } from "@/components/movie/VideoList";
import { RatingDisplay } from "@/components/movie/RatingDisplay";
import { MovieMeta } from "@/components/movie/MovieMeta";
import { ErrorState } from "@/components/ErrorState";
import { SafeImage } from "@/components/SafeImage";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/icon";
import { useCompleteMovieData } from "@/hooks/useMovie";
import { useSimilarMovies, useMovieRecommendations } from "@/hooks/useMovie";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePageTitle } from "@/hooks/usePageTitle";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

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
        <PageContainer className="-mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <Skeleton className="shrink-0 w-48 md:w-64 aspect-2/3 rounded-lg mx-auto md:mx-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-18 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
          <Separator className="my-8" />
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex gap-4 pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center w-24 shrink-0">
                <Skeleton className="w-20 h-20 rounded-full mb-2" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-16 mt-1" />
              </div>
            ))}
          </div>
        </PageContainer>
      </div>
    );
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;

  return (
    <div>
      <div className="relative w-full h-[50vh] min-h-87.5 max-h-150 overflow-hidden">
        {movie.backdrop_path && (
          <SafeImage
            src={`${BACKDROP_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            fallbackClassName="absolute inset-0 w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      <PageContainer className="-mt-32 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="shrink-0 mx-auto md:mx-0">
            {movie.poster_path ? (
              <SafeImage
                src={`${POSTER_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="w-48 md:w-64 rounded-lg shadow-lg"
                fallbackClassName="w-48 md:w-64 aspect-[2/3] rounded-lg"
              />
            ) : (
              <div className="w-48 md:w-64 aspect-2/3 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
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
              <MovieMeta
                year={year}
                runtimeHours={runtimeHours}
                runtimeMins={runtimeMins}
                genres={movie.genres}
              />
              <RatingDisplay voteAverage={movie.vote_average} voteCount={movie.vote_count} />
            </div>

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

        {movie.credits && (
          <ScrollReveal>
            <CastList cast={movie.credits.cast} />
          </ScrollReveal>
        )}

        {movie.videos && (
          <ScrollReveal>
            <VideoList videos={movie.videos.results} />
          </ScrollReveal>
        )}

        <ScrollReveal>
          <MovieCarousel
            title="Similar Movies"
            movies={similar.data?.data?.results}
            isLoading={similar.isLoading}
          />
        </ScrollReveal>

        <ScrollReveal>
          <MovieCarousel
            title="Recommended"
            movies={recommendations.data?.data?.results}
            isLoading={recommendations.isLoading}
          />
        </ScrollReveal>
      </PageContainer>
    </div>
  );
}
