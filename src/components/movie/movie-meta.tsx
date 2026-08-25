import Link from "next/link";

export type MovieGenre = {
  id: number;
  name: string;
};

export type MovieMetaProps = {
  year?: number | null;
  runtime?: number | null;
  genres?: MovieGenre[];
};

export function formatRuntime(minutes: number | null | undefined): string | null {
  if (minutes == null || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function MovieMeta({ year, runtime, genres }: MovieMetaProps) {
  const runtimeLabel = formatRuntime(runtime);
  const facts = [year, runtimeLabel].filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {facts.length > 0 ? (
        <p className="font-mono text-xs tracking-widest uppercase opacity-60">
          {facts.join(" · ")}
        </p>
      ) : null}
      {genres && genres.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <li key={genre.id}>
              <Link
                href={`/genre/${genre.id}`}
                className="inline-flex h-7 items-center rounded-sm border border-current/20 px-2.5 font-mono text-xs tracking-widest uppercase opacity-80 transition-opacity hover:opacity-100"
              >
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
