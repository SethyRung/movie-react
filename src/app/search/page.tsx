import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "./search-page";

export const metadata: Metadata = {
  title: "Search",
};

function SearchFallback() {
  return (
    <div className="mx-auto flex w-full max-w-340 flex-col gap-8 px-6 py-12 md:py-16">
      <header>
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Search</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl md:leading-none">
          Search Movies
        </h1>
      </header>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPage />
    </Suspense>
  );
}
