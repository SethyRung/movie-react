import Image from "next/image";
import { MovieMeta } from "@/components/movie/movie-meta";
import { RatingDisplay } from "@/components/movie/rating-display";
import { releaseYear, tmdbImageUrl } from "@/lib/tmdb-image";
import type { CompleteMovieData } from "@/services/movie/validation";

export type MovieDetailHeroProps = {
  movie: CompleteMovieData;
};

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const backdropUrl = tmdbImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = tmdbImageUrl(movie.poster_path, "w500");
  const year = releaseYear(movie.release_date);
  const companies = movie.production_companies?.map((company) => company.name).filter(Boolean);

  return (
    <section className="bg-hero text-hero-foreground relative overflow-hidden">
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
      ) : null}
      <div className="from-hero via-hero/80 absolute inset-0 bg-linear-to-t to-transparent" />

      <div className="relative mx-auto flex min-h-112 w-full max-w-340 flex-col justify-end gap-10 px-6 py-16 md:min-h-136 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-2xl">
          <p className="text-hero-foreground/50 font-mono text-xs tracking-widest uppercase">
            Film
          </p>
          <h1 className="mt-3 text-4xl leading-none font-semibold tracking-tight md:text-6xl md:tracking-tighter">
            {movie.title}
          </h1>
          {movie.tagline ? (
            <p className="text-hero-foreground/70 mt-4 text-lg leading-relaxed italic">
              {movie.tagline}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-4">
            <MovieMeta year={year} runtime={movie.runtime} genres={movie.genres} />
            {movie.vote_average > 0 ? (
              <RatingDisplay
                voteAverage={movie.vote_average}
                voteCount={movie.vote_count}
                size="md"
                className="bg-hero-foreground text-hero w-fit"
              />
            ) : null}
          </div>

          {movie.overview ? (
            <p className="text-hero-foreground/70 mt-6 max-w-xl text-lg leading-relaxed">
              {movie.overview}
            </p>
          ) : null}

          {companies && companies.length > 0 ? (
            <div className="mt-8">
              <p className="text-hero-foreground/50 font-mono text-xs tracking-widest uppercase">
                Production
              </p>
              <p className="text-hero-foreground/70 mt-2 text-sm leading-relaxed">
                {companies.join(", ")}
              </p>
            </div>
          ) : null}
        </div>

        {posterUrl ? (
          <div className="relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-sm border border-hero-foreground/15 sm:w-52">
            <Image src={posterUrl} alt={movie.title} fill sizes="208px" className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
