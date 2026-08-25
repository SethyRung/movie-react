import { UserIcon } from "lucide-react";
import Image from "next/image";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import type { Person } from "@/services/person/validation";

export type PersonProfileProps = {
  person: Person;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function formatIsoDate(value: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return value;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function PersonProfile({ person }: PersonProfileProps) {
  const photoUrl = tmdbImageUrl(person.profile_path, "w500");
  const birthday = formatIsoDate(person.birthday);
  const deathday = formatIsoDate(person.deathday);
  const aliases = person.also_known_as?.filter(Boolean) ?? [];
  const facts = [
    birthday ? { label: "Born", value: birthday } : null,
    deathday ? { label: "Died", value: deathday } : null,
    person.place_of_birth ? { label: "From", value: person.place_of_birth } : null,
  ].filter((fact) => fact != null);

  return (
    <>
      <section className="bg-hero text-hero-foreground relative overflow-hidden">
        <div className="relative mx-auto flex min-h-112 w-full max-w-340 flex-col justify-end gap-10 px-6 py-16 md:min-h-136 md:flex-row md:items-end md:justify-between md:py-20">
          <div className="max-w-2xl">
            <p className="text-hero-foreground/50 font-mono text-xs tracking-widest uppercase">
              {person.known_for_department || "Person"}
            </p>
            <h1 className="mt-3 text-4xl leading-none font-semibold tracking-tight md:text-6xl md:tracking-tighter">
              {person.name}
            </h1>
            {facts.length > 0 ? (
              <dl className="mt-8 flex flex-col gap-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-hero-foreground/50 font-mono text-xs tracking-widest uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-hero-foreground/80 mt-1 text-sm leading-relaxed">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-sm border border-hero-foreground/15 bg-hero sm:w-52">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={person.name}
                fill
                priority
                sizes="208px"
                className="object-cover"
              />
            ) : (
              <div className="text-hero-foreground/50 flex h-full flex-col items-center justify-center gap-2 text-sm">
                <UserIcon className="size-6" />
                No image
              </div>
            )}
          </div>
        </div>
      </section>

      {person.biography || aliases.length > 0 ? (
        <div className="mx-auto flex w-full max-w-340 flex-col gap-12 px-6 py-16 md:py-20">
          {person.biography ? (
            <section className="max-w-3xl">
              <h2 className="text-xl font-semibold tracking-tight">Biography</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed whitespace-pre-wrap">
                {person.biography}
              </p>
            </section>
          ) : null}

          {aliases.length > 0 ? (
            <section className="max-w-3xl">
              <h2 className="text-xl font-semibold tracking-tight">Also known as</h2>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {aliases.join(", ")}
              </p>
            </section>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
