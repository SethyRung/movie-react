import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/fetch-mock";
import { discoveryMovie, popularPage } from "@/test/fixtures/tmdb";
import MoviesPage from "./page";

async function renderMovies(searchParams: Record<string, string> = {}) {
  return renderToStaticMarkup(await MoviesPage({ searchParams: Promise.resolve(searchParams) }));
}

describe("GET /movies", () => {
  it("renders the popular discovery list on page 1 by default", async () => {
    const fetch = mockFetch();
    fetch.json(
      popularPage({
        results: [discoveryMovie({ id: 27205, title: "Inception" })],
      }),
    );

    const html = await renderMovies();

    expect(html).toContain("Inception");
    expect(html).toContain("/movies/27205");
    expect(html).toContain(">Popular Movies<");
    expect(fetch.calls[0]?.url.pathname).toBe("/3/movie/popular");
    expect(fetch.calls[0]?.url.searchParams.get("page")).toBe("1");
  });

  it("changes the discovery request when kind and page searchParams change", async () => {
    const fetch = mockFetch();
    fetch.json(
      popularPage({
        page: 2,
        total_pages: 8,
        results: [discoveryMovie({ id: 238, title: "The Godfather" })],
      }),
    );

    const html = await renderMovies({ kind: "topRated", page: "2" });

    expect(html).toContain("The Godfather");
    expect(html).toContain("/movies/238");
    expect(html).toContain(">Top Rated Movies<");
    expect(html).toContain("/movies?kind=topRated");
    expect(html).toContain("/movies?kind=topRated&amp;page=3");
    expect(fetch.calls[0]?.url.pathname).toBe("/3/movie/top_rated");
    expect(fetch.calls[0]?.url.searchParams.get("page")).toBe("2");
  });
});
