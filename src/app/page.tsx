import type { Metadata } from "next";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieCarousel } from "@/components/movie/movie-carousel";
import { MovieHero } from "@/components/movie/movie-hero";
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
      <section className="mx-auto flex min-h-dvh w-full max-w-340 flex-col justify-end px-6 py-18">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          Discovery
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl leading-none font-medium tracking-tight md:text-6xl md:tracking-tighter">
          Could not load discovery lists
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
          Movie lists are unavailable right now. Try again shortly.
        </p>
      </section>
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
