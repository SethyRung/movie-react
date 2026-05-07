import PageContainer from "@/components/layout/PageContainer";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/icon";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function AboutPage() {
  usePageTitle("About");

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-4">About CinePhil</h1>
      <p className="text-muted-foreground leading-relaxed mb-6">
        CinePhil is a curated movie discovery experience built for cinephiles. Browse popular
        releases, explore top-rated classics, and keep track of films you want to watch — all in one
        place.
      </p>

      <Separator className="my-6" />

      <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Features</h2>
      <ul className="space-y-3 text-muted-foreground">
        <li className="flex items-start gap-3">
          <Icon icon="lucide:search" className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
          <span>Search and browse movies from The Movie Database (TMDB)</span>
        </li>
        <li className="flex items-start gap-3">
          <Icon icon="lucide:bookmark" className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
          <span>Save movies to your personal watchlist</span>
        </li>
        <li className="flex items-start gap-3">
          <Icon icon="lucide:film" className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
          <span>Explore detailed movie info, cast, videos, and recommendations</span>
        </li>
        <li className="flex items-start gap-3">
          <Icon icon="lucide:layout-grid" className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
          <span>Discover movies by genre, popularity, and release date</span>
        </li>
      </ul>

      <Separator className="my-6" />

      <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Data Attribution</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        This product uses the{" "}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          TMDB API
        </a>{" "}
        but is not endorsed or certified by TMDB.
      </p>
    </PageContainer>
  );
}
