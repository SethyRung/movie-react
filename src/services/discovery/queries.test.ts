import { describe, expect, it } from "vitest";
import { isServiceError } from "@/services/error";
import { mockFetch } from "@/test/fetch-mock";
import { popularPage } from "@/test/fixtures/tmdb";
import { discoverList } from "./queries";

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
