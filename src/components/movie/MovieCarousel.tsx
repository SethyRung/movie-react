import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";
import type { Movie } from "@/services/movie/validation";
import type { DiscoveryMovie } from "@/services/discovery/validation";

export type MovieCarouselProps = {
  title: string;
  movies?: Movie[] | DiscoveryMovie[];
  isLoading?: boolean;
  skeletonCount?: number;
};

export function MovieCarousel({ title, movies, isLoading, skeletonCount = 6 }: MovieCarouselProps) {
  return (
    <section className="py-6">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <MovieCardSkeleton />
                </CarouselItem>
              ))
            : movies?.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <MovieCard movie={movie} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>
    </section>
  );
}
