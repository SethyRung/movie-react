import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CastCard } from "./CastCard";
import type { CastMember } from "@/services/movie/validation";

export type CastListProps = {
  cast: CastMember[];
  limit?: number;
};

export function CastList({ cast, limit = 12 }: CastListProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Top Cast</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {cast.slice(0, limit).map((person) => (
            <CastCard key={person.credit_id} person={person} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
