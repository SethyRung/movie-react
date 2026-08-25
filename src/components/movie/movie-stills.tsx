import Image from "next/image";
import { MovieCarousel } from "@/components/movie/movie-carousel";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import type { MovieImage } from "@/services/movie/validation";

export type MovieStillsProps = {
  images: MovieImage[];
  limit?: number;
};

export function MovieStills({ images, limit = 8 }: MovieStillsProps) {
  const stills = images.slice(0, limit).filter((image) => image.file_path);
  if (stills.length === 0) return null;

  return (
    <MovieCarousel title="Stills">
      {stills.map((image) => {
        const src = tmdbImageUrl(image.file_path, "w780");
        if (!src) return null;

        return (
          <div
            key={image.file_path}
            className="relative aspect-video w-72 shrink-0 snap-start overflow-hidden rounded-sm border border-border bg-card sm:w-80"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 80vw, 320px"
              className="object-cover"
            />
          </div>
        );
      })}
    </MovieCarousel>
  );
}
