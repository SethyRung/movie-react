import { describe, expect, it } from "vitest";
import { isServiceError } from "@/services/error";
import { mockFetch } from "@/test/fetch-mock";
import { discoveryMovie, popularPage } from "@/test/fixtures/tmdb";
import { searchMovies } from "./queries";

describe("searchMovies", () => {
  it("returns the parsed search page from a mocked TMDB response", async () => {
    const fetch = mockFetch();
    fetch.json(
      popularPage({
        results: [discoveryMovie({ id: 27205, title: "Inception" })],
      }),
    );

    const result = await searchMovies("inception", { page: 1 });

    expect(result.results[0]?.title).toBe("Inception");
    expect(result.page).toBe(1);
    expect(result.total_pages).toBe(10);
    expect(fetch.calls[0]?.url.pathname).toBe("/3/search/movie");
    expect(fetch.calls[0]?.url.searchParams.get("query")).toBe("inception");
    expect(fetch.calls[0]?.url.searchParams.get("page")).toBe("1");
  });

  it("throws a ServiceError when TMDB responds non-ok", async () => {
    mockFetch().error(500, "Internal error.");

    try {
      await searchMovies("inception");
      expect.unreachable("expected searchMovies to throw");
    } catch (error) {
      expect(isServiceError(error)).toBe(true);
      expect(error).toMatchObject({ code: "INTERNAL_SERVER_ERROR", statusCode: 500 });
    }
  });
});
