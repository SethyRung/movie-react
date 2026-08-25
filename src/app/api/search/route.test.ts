import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/fetch-mock";
import { discoveryMovie, popularPage } from "@/test/fixtures/tmdb";
import { GET } from "./route";

async function search(query: string, page?: string) {
  const url = new URL("http://localhost/api/search");
  if (query) url.searchParams.set("q", query);
  if (page) url.searchParams.set("page", page);
  return GET(new Request(url));
}

describe("GET /api/search", () => {
  it("returns the paginated movie JSON shape for a query", async () => {
    const fetch = mockFetch();
    fetch.json(
      popularPage({
        page: 2,
        total_pages: 4,
        total_results: 40,
        results: [discoveryMovie({ id: 27205, title: "Inception" })],
      }),
    );

    const response = await search("inception", "2");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      page: 2,
      total_pages: 4,
      total_results: 40,
      results: [{ id: 27205, title: "Inception" }],
    });
    expect(JSON.stringify(body)).not.toContain("test-key");
    expect(fetch.calls[0]?.url.pathname).toBe("/3/search/movie");
    expect(fetch.calls[0]?.url.searchParams.get("query")).toBe("inception");
    expect(fetch.calls[0]?.url.searchParams.get("page")).toBe("2");
  });

  it("returns an empty page without calling TMDB when the query is missing", async () => {
    const fetch = mockFetch();

    const response = await search("");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0,
    });
    expect(fetch.calls).toHaveLength(0);
  });
});
