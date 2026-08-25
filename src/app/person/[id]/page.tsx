import type { Metadata } from "next";
import { PersonProfile } from "@/components/person/person-profile";
import { StatusSection } from "@/components/status-section";
import { isNotFoundError, parseRouteId } from "@/lib/route-id";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { getPerson } from "@/services/person/queries";

type PersonDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PersonDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const personId = parseRouteId(id);
  if (personId == null) return { title: "Person not found" };

  try {
    const person = await getPerson(personId);
    const description = person.biography || person.known_for_department || undefined;
    const image = tmdbImageUrl(person.profile_path, "w500");

    return {
      title: person.name,
      description,
      openGraph: {
        title: person.name,
        description,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch (error) {
    return { title: isNotFoundError(error) ? "Person not found" : "Person" };
  }
}

export default async function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { id } = await params;
  const personId = parseRouteId(id);
  if (personId == null) {
    return (
      <StatusSection
        label="Person"
        title="Person not found"
        message="This person is unavailable or the link is invalid."
      />
    );
  }

  const result = await getPerson(personId).then(
    (value) => ({ ok: true as const, value }),
    (error: unknown) => ({ ok: false as const, error }),
  );

  if (!result.ok) {
    if (isNotFoundError(result.error)) {
      return (
        <StatusSection
          label="Person"
          title="Person not found"
          message="This person is unavailable or the link is invalid."
        />
      );
    }

    return (
      <StatusSection
        label="Person"
        title="Could not load person"
        message="Person details are unavailable right now. Try again shortly."
      />
    );
  }

  return <PersonProfile person={result.value} />;
}
