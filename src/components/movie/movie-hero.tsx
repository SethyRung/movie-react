import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { releaseYear, tmdbImageUrl } from "@/lib/tmdb-image";

export type MovieHeroMovie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average?: number;
  vote_count?: number;
};

export type MovieHeroProps = {
  movie: MovieHeroMovie;
};

export function MovieHero({ movie }: MovieHeroProps) {
  const backdropUrl = tmdbImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = tmdbImageUrl(movie.poster_path, "w500");
  const year = releaseYear(movie.release_date);
  const rating = movie.vote_average ?? 0;

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
            Featured
          </p>
          <h1 className="mt-3 text-4xl leading-none font-semibold tracking-tight md:text-6xl md:tracking-tighter">
            {movie.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {year ? (
              <span className="text-hero-foreground/60 font-mono text-xs tracking-widest uppercase">
                {year}
              </span>
            ) : null}
            {rating > 0 ? (
              <span className="text-hero-foreground/60 font-mono text-xs tracking-widest uppercase">
                {rating.toFixed(1)}
                {movie.vote_count != null ? ` · ${movie.vote_count.toLocaleString()} votes` : null}
              </span>
            ) : null}
          </div>
          {movie.overview ? (
            <p className="text-hero-foreground/70 mt-5 max-w-xl text-lg leading-relaxed">
              {movie.overview}
            </p>
          ) : null}
          <Link href={`/movies/${movie.id}`} className="mt-8 block">
            <Button className="">
              View details
              <ArrowRightIcon />
            </Button>
          </Link>
        </div>

        {posterUrl ? (
          <div className="relative hidden aspect-2/3 w-52 shrink-0 overflow-hidden rounded-sm border border-hero-foreground/15 md:block">
            <Image src={posterUrl} alt={movie.title} fill sizes="208px" className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
