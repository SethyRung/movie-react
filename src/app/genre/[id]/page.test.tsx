import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/fetch-mock";
import { discoveryMovie, popularPage } from "@/test/fixtures/tmdb";
import GenrePage from "./page";

async function renderGenre(id: string, searchParams: Record<string, string> = {}) {
  return renderToStaticMarkup(
    await GenrePage({
      params: Promise.resolve({ id }),
      searchParams: Promise.resolve(searchParams),
    }),
  );
}

describe("GET /genre/:id", () => {
  it("renders the first page of movies for that genre", async () => {
    const fetch = mockFetch();
    fetch.json(
      popularPage({
        results: [discoveryMovie({ id: 27205, title: "Inception" })],
      }),
    );

    const html = await renderGenre("28");

    expect(html).toContain("Inception");
    expect(html).toContain("/movies/27205");
    expect(html).toContain("Action Movies");
    expect(fetch.calls[0]?.url.pathname).toBe("/3/discover/movie");
    expect(fetch.calls[0]?.url.searchParams.get("with_genres")).toBe("28");
    expect(fetch.calls[0]?.url.searchParams.get("page")).toBe("1");
  });

  it("changes the genre request when the page searchParam changes", async () => {
    const fetch = mockFetch();
    fetch.json(
      popularPage({
        page: 2,
        total_pages: 5,
        results: [discoveryMovie({ id: 238, title: "The Godfather" })],
      }),
    );

    const html = await renderGenre("18", { page: "2" });

    expect(html).toContain("The Godfather");
    expect(html).toContain("/movies/238");
    expect(html).toContain("Drama Movies");
    expect(html).toContain("/genre/18");
    expect(html).toContain("/genre/18?page=3");
    expect(fetch.calls[0]?.url.pathname).toBe("/3/discover/movie");
    expect(fetch.calls[0]?.url.searchParams.get("with_genres")).toBe("18");
    expect(fetch.calls[0]?.url.searchParams.get("page")).toBe("2");
  });
});
