import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export type MovieMetaProps = {
  year?: number | null;
  runtimeHours?: number;
  runtimeMins?: number;
  genres?: { id: number; name: string }[];
};

export function MovieMeta({ year, runtimeHours, runtimeMins, genres }: MovieMetaProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {year && <Badge variant="outline">{year}</Badge>}
        {typeof runtimeHours === "number" &&
          typeof runtimeMins === "number" &&
          runtimeHours + runtimeMins > 0 && (
            <Badge variant="outline">
              {runtimeHours}h {runtimeMins}m
            </Badge>
          )}
      </div>

      {genres && genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <Link key={g.id} to={`/genre/${g.id}`}>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {g.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
