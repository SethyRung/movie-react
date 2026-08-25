import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import type { CastMember } from "@/services/movie/validation";

export type CastCardProps = {
  person: CastMember;
};

export function CastCard({ person }: CastCardProps) {
  const photoUrl = tmdbImageUrl(person.profile_path, "w185");

  return (
    <Link
      href={`/person/${person.id}`}
      className="group flex w-40 shrink-0 snap-start flex-col gap-2 sm:w-44"
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-sm border border-border bg-card">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 40vw, 176px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
            <UserIcon className="size-6" />
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
          {person.name}
        </h3>
        {person.character ? (
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {person.character}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
