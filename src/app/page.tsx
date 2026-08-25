import type { Metadata } from "next";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieCarousel } from "@/components/movie/movie-carousel";
import { MovieHero } from "@/components/movie/movie-hero";
import { StatusSection } from "@/components/status-section";
import {
  getDiscoveryLists,
  type DiscoveryLists,
  type ListKind,
} from "@/services/discovery/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

const SECTIONS: { kind: ListKind; title: string; href: string }[] = [
  { kind: "popular", title: "Popular", href: "/movies" },
  { kind: "nowPlaying", title: "Now Playing", href: "/movies?kind=nowPlaying" },
  { kind: "upcoming", title: "Upcoming", href: "/movies?kind=upcoming" },
  { kind: "topRated", title: "Top Rated", href: "/movies?kind=topRated" },
];

async function loadDiscoveryLists(): Promise<DiscoveryLists> {
  try {
    return await getDiscoveryLists();
  } catch {
    return {};
  }
}

export default async function Home() {
  const lists = await loadDiscoveryLists();
  const featured = lists.popular?.results[0];
  const hasLists = SECTIONS.some(({ kind }) => (lists[kind]?.results.length ?? 0) > 0);

  if (!hasLists) {
    return (
      <StatusSection
        label="Discovery"
        title="Could not load discovery lists"
        message="Movie lists are unavailable right now. Try again shortly."
      />
    );
  }

  return (
    <>
      {featured ? <MovieHero movie={featured} /> : null}
      <div className="mx-auto flex w-full max-w-340 flex-col gap-18 px-6 py-18">
        {SECTIONS.map(({ kind, title, href }) => {
          const movies = lists[kind]?.results;
          if (!movies?.length) return null;

          return (
            <MovieCarousel key={kind} title={title} href={href}>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </MovieCarousel>
          );
        })}
      </div>
    </>
  );
}
