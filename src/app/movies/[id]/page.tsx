import type { Metadata } from "next";
import { CastList } from "@/components/movie/cast-list";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieCarousel } from "@/components/movie/movie-carousel";
import { MovieDetailHero } from "@/components/movie/movie-detail-hero";
import { MovieStills } from "@/components/movie/movie-stills";
import { VideoList } from "@/components/movie/video-list";
import { StatusSection } from "@/components/status-section";
import { isNotFoundError, parseRouteId } from "@/lib/route-id";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import {
  getCompleteMovieData,
  getMovieRecommendations,
  getSimilarMovies,
} from "@/services/movie/queries";
import type { CompleteMovieData, PaginatedMovieResponse } from "@/services/movie/validation";

type MovieDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

function settledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseRouteId(id);
  if (movieId == null) return { title: "Movie not found" };

  try {
    const movie = await getCompleteMovieData(movieId);
    const description = movie.overview || movie.tagline || undefined;
    const image = tmdbImageUrl(movie.backdrop_path ?? movie.poster_path, "w1280");

    return {
      title: movie.title,
      description,
      openGraph: {
        title: movie.title,
        description,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch (error) {
    return { title: isNotFoundError(error) ? "Movie not found" : "Movie" };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseRouteId(id);
  if (movieId == null) {
    return (
      <StatusSection
        label="Film"
        title="Movie not found"
        message="This title is unavailable or the link is invalid."
      />
    );
  }

  const [movieResult, similarResult, recommendationsResult] = await Promise.allSettled([
    getCompleteMovieData(movieId),
    getSimilarMovies(movieId),
    getMovieRecommendations(movieId),
  ]);

  if (movieResult.status === "rejected") {
    if (isNotFoundError(movieResult.reason)) {
      return (
        <StatusSection
          label="Film"
          title="Movie not found"
          message="This title is unavailable or the link is invalid."
        />
      );
    }

    return (
      <StatusSection
        label="Film"
        title="Could not load movie"
        message="Movie details are unavailable right now. Try again shortly."
      />
    );
  }

  const movie: CompleteMovieData = movieResult.value;
  const similar = settledValue<PaginatedMovieResponse>(similarResult)?.results ?? [];
  const recommendations =
    settledValue<PaginatedMovieResponse>(recommendationsResult)?.results ?? [];

  return (
    <>
      <MovieDetailHero movie={movie} />
      <div className="mx-auto flex w-full max-w-340 flex-col gap-16 px-6 py-16 md:py-20">
        {movie.credits ? <CastList cast={movie.credits.cast} /> : null}
        {movie.videos ? <VideoList videos={movie.videos.results} /> : null}
        {movie.images ? <MovieStills images={movie.images.backdrops} /> : null}

        {similar.length > 0 ? (
          <MovieCarousel title="Similar Movies">
            {similar.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </MovieCarousel>
        ) : null}

        {recommendations.length > 0 ? (
          <MovieCarousel title="Recommended">
            {recommendations.map((item) => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </MovieCarousel>
        ) : null}
      </div>
    </>
  );
}
