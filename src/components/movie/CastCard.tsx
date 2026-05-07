import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { CastMember } from "@/services/movie/validation";

const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

export type CastCardProps = {
  person: CastMember;
};

export function CastCard({ person }: CastCardProps) {
  return (
    <div className="flex flex-col items-center w-24 shrink-0">
      <Avatar className="w-20 h-20 mb-2">
        {person.profile_path ? (
          <AvatarImage src={`${PROFILE_BASE}${person.profile_path}`} alt={person.name} />
        ) : null}
        <AvatarFallback className="text-xs">
          {person.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <p className="text-xs font-medium text-foreground text-center line-clamp-1 w-full">
        {person.name}
      </p>
      <p className="text-[10px] text-muted-foreground text-center line-clamp-1 w-full">
        {person.character}
      </p>
    </div>
  );
}
