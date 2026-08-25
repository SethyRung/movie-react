import type { Metadata } from "next";
import { PersonProfile } from "@/components/person/person-profile";
import { tmdbImageUrl } from "@/lib/tmdb-image";
import { isServiceError } from "@/services/error";
import { getPerson } from "@/services/person/queries";

type PersonDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

function parsePersonId(id: string): number | null {
  if (!/^\d+$/.test(id)) return null;
  const personId = Number(id);
  return Number.isInteger(personId) && personId > 0 ? personId : null;
}

function isNotFoundError(error: unknown): boolean {
  return isServiceError(error) && (error.code === "NOT_FOUND" || error.statusCode === 404);
}

function PersonStatus({ title, message }: { title: string; message: string }) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-340 flex-col justify-end px-6 py-18">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Person</p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-none font-medium tracking-tight md:text-6xl md:tracking-tighter">
        {title}
      </h1>
      <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">{message}</p>
    </section>
  );
}

export async function generateMetadata({ params }: PersonDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const personId = parsePersonId(id);
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
  const personId = parsePersonId(id);
  if (personId == null) {
    return (
      <PersonStatus
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
        <PersonStatus
          title="Person not found"
          message="This person is unavailable or the link is invalid."
        />
      );
    }

    return (
      <PersonStatus
        title="Could not load person"
        message="Person details are unavailable right now. Try again shortly."
      />
    );
  }

  return <PersonProfile person={result.value} />;
}
