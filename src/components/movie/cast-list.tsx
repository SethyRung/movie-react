import { CastCard } from "@/components/movie/cast-card";
import { MovieCarousel } from "@/components/movie/movie-carousel";
import type { CastMember } from "@/services/movie/validation";

export type CastListProps = {
  cast: CastMember[];
  limit?: number;
};

export function CastList({ cast, limit = 12 }: CastListProps) {
  const people = cast.slice(0, limit);
  if (people.length === 0) return null;

  return (
    <MovieCarousel title="Top Cast">
      {people.map((person) => (
        <CastCard key={person.credit_id} person={person} />
      ))}
    </MovieCarousel>
  );
}
