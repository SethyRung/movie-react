"use client";

import { BookmarkIcon } from "lucide-react";
import Link from "next/link";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieGrid } from "@/components/movie/movie-grid";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/use-watchlist";

export function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-8 px-6 py-12 md:py-16">
      <header>
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Saved</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl md:leading-none">
          Watchlist
        </h1>
      </header>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <BookmarkIcon className="text-muted-foreground size-12" />
          <h2 className="text-xl font-semibold tracking-tight">Your watchlist is empty</h2>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            Save movies you want to watch later from any title card or movie page.
          </p>
          <Button asChild className="mt-2 min-h-11 px-4">
            <Link href="/movies">Browse movies</Link>
          </Button>
        </div>
      ) : (
        <MovieGrid>
          {watchlist.map((item) => (
            <MovieCard key={item.id} movie={item} className="w-full" />
          ))}
        </MovieGrid>
      )}
    </div>
  );
}
