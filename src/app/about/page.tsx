import type { Metadata } from "next";
import { BookmarkIcon, FilmIcon, LayoutGridIcon, SearchIcon } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
};

const FEATURES = [
  {
    icon: SearchIcon,
    text: "Search and browse movies from The Movie Database (TMDB)",
  },
  {
    icon: BookmarkIcon,
    text: "Save movies to your personal watchlist",
  },
  {
    icon: FilmIcon,
    text: "Explore detailed movie info, cast, videos, and recommendations",
  },
  {
    icon: LayoutGridIcon,
    text: "Discover movies by genre, popularity, and release date",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-16 px-6 py-12 md:py-16">
      <header className="max-w-2xl">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">About</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-6xl md:leading-none md:tracking-tighter">
          {site.name}
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
          A curated movie discovery experience built for cinephiles. Browse popular releases,
          explore top-rated classics, and keep track of films you want to watch — all in one place.
        </p>
      </header>

      <section className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight">Features</h2>
        <ul className="mt-6 flex flex-col gap-4">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon className="text-muted-foreground mt-1 size-5 shrink-0" />
              <span className="text-muted-foreground text-lg leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight">Data attribution</h2>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          This product uses the{" "}
          <a
            href={site.tmdb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-4 hover:underline"
          >
            TMDB API
          </a>{" "}
          but is not endorsed or certified by TMDB.
        </p>
      </section>
    </div>
  );
}
