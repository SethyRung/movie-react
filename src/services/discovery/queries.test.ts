import { describe, expect, it } from "vitest";
import { isServiceError } from "@/services/error";
import { mockFetch } from "@/test/fetch-mock";
import { popularPage } from "@/test/fixtures/tmdb";
import { discoverList, getDiscoveryLists } from "./queries";

describe("discoverList", () => {
  it("returns the parsed popular page from a mocked TMDB response", async () => {
    mockFetch().json(popularPage());

    const result = await discoverList("popular");

    expect(result.results[0]?.title).toBe("Inception");
    expect(result.page).toBe(1);
    expect(result.total_pages).toBe(10);
  });

  it("throws a ServiceError when TMDB responds non-ok", async () => {
    mockFetch().error(404, "The resource you requested could not be found.");

    try {
      await discoverList("popular");
      expect.unreachable("expected discoverList to throw");
    } catch (error) {
      expect(isServiceError(error)).toBe(true);
      expect(error).toMatchObject({ code: "NOT_FOUND", statusCode: 404 });
    }
  });
});

describe("getDiscoveryLists", () => {
  it("returns the lists that succeed when some discovery requests fail", async () => {
    const page = popularPage();

    mockFetch().handle(async (url) => {
      if (url.pathname.endsWith("/movie/upcoming")) {
        return new Response(JSON.stringify({ status_code: 500, status_message: "boom" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(JSON.stringify(page), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const result = await getDiscoveryLists();

    expect(result.popular?.results[0]?.title).toBe("Inception");
    expect(result.nowPlaying?.results[0]?.title).toBe("Inception");
    expect(result.topRated?.results[0]?.title).toBe("Inception");
    expect(result.upcoming).toBeUndefined();
  });

  it("throws a ServiceError when every discovery list fails", async () => {
    mockFetch().error(500, "boom");

    try {
      await getDiscoveryLists();
      expect.unreachable("expected getDiscoveryLists to throw");
    } catch (error) {
      expect(isServiceError(error)).toBe(true);
      expect(error).toMatchObject({
        code: "ALL_DISCOVERY_REQUESTS_FAILED",
        message: "All discovery list requests failed",
      });
    }
  });
});
