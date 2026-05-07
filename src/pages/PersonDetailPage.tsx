import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { SafeImage } from "@/components/SafeImage";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerson } from "@/hooks/usePerson";
import { usePageTitle } from "@/hooks/usePageTitle";

const PROFILE_BASE = "https://image.tmdb.org/t/p/w500";

export default function PersonDetailPage() {
  const { personId } = useParams<{ personId: string }>();
  const id = Number(personId);

  const { data: person, isLoading, isError, refetch } = usePerson(id);

  usePageTitle(person?.name || "Person");

  if (isError) {
    return (
      <PageContainer className="min-h-[50vh]">
        <ErrorState message="Failed to load person details." onRetry={refetch} />
      </PageContainer>
    );
  }

  if (isLoading || !person) {
    return (
      <PageContainer>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <Skeleton className="shrink-0 w-48 md:w-64 aspect-2/3 rounded-lg mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="shrink-0 mx-auto md:mx-0">
          {person.profile_path ? (
            <SafeImage
              src={`${PROFILE_BASE}${person.profile_path}`}
              alt={person.name}
              className="w-48 md:w-64 rounded-lg shadow-lg"
              fallbackClassName="w-48 md:w-64 aspect-[2/3] rounded-lg"
            />
          ) : (
            <div className="w-48 md:w-64 aspect-2/3 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground">
            {person.name}
          </h1>

          {person.known_for_department && (
            <p className="text-sm text-muted-foreground mt-1">{person.known_for_department}</p>
          )}

          {(person.birthday || person.place_of_birth) && (
            <div className="flex flex-wrap gap-2 mt-3 text-sm text-muted-foreground">
              {person.birthday && <span>Born: {person.birthday}</span>}
              {person.place_of_birth && <span>• {person.place_of_birth}</span>}
              {person.deathday && <span>• Died: {person.deathday}</span>}
            </div>
          )}

          {person.biography && (
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{person.biography}</p>
          )}

          {person.also_known_as && person.also_known_as.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Also Known As
              </h3>
              <p className="text-sm text-foreground">{person.also_known_as.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
