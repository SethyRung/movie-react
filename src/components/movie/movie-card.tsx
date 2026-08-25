import { FilmIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RatingDisplay } from "@/components/movie/rating-display";
import { releaseYear, tmdbImageUrl } from "@/lib/tmdb-image";
import { cn } from "@/lib/utils";

export type MovieCardMovie = {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number;
};

export type MovieCardProps = {
  movie: MovieCardMovie;
  className?: string;
};

export function MovieCard({ movie, className }: MovieCardProps) {
  const posterUrl = tmdbImageUrl(movie.poster_path, "w342");
  const year = releaseYear(movie.release_date);
  const rating = movie.vote_average ?? 0;

  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn("group flex w-40 shrink-0 snap-start flex-col gap-2 sm:w-44", className)}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-sm border border-border bg-card">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 40vw, 176px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
            <FilmIcon className="size-6" />
            No image
          </div>
        )}
        {rating > 0 ? (
          <div className="absolute top-2 right-2 z-1 rounded-sm bg-hero">
            <RatingDisplay voteAverage={rating} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
          {movie.title}
        </h3>
        {year ? (
          <p className="text-muted-foreground font-mono text-xs tracking-widest">{year}</p>
        ) : null}
      </div>
    </Link>
  );
}
