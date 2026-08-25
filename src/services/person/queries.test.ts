import { describe, expect, it } from "vitest";
import { isServiceError } from "@/services/error";
import { mockFetch } from "@/test/fetch-mock";
import { person } from "@/test/fixtures/tmdb";
import { getPerson } from "./queries";

describe("getPerson", () => {
  it("returns the parsed person from a mocked TMDB response", async () => {
    const fetch = mockFetch();
    fetch.json(person());

    const result = await getPerson(6193);

    expect(result.id).toBe(6193);
    expect(result.name).toBe("Leonardo DiCaprio");
    expect(result.known_for_department).toBe("Acting");
    expect(result.biography).toBe(
      "Leonardo Wilhelm DiCaprio is an American actor and film producer.",
    );
    expect(fetch.calls[0]?.url.pathname).toBe("/3/person/6193");
  });

  it("throws a ServiceError when TMDB responds non-ok", async () => {
    mockFetch().error(404, "The resource you requested could not be found.");

    try {
      await getPerson(6193);
      expect.unreachable("expected getPerson to throw");
    } catch (error) {
      expect(isServiceError(error)).toBe(true);
      expect(error).toMatchObject({ code: "NOT_FOUND", statusCode: 404 });
    }
  });

  it("throws a ServiceError when the person payload fails validation", async () => {
    mockFetch().json({ id: 6193, name: "Leonardo DiCaprio" });

    try {
      await getPerson(6193);
      expect.unreachable("expected getPerson to throw");
    } catch (error) {
      expect(isServiceError(error)).toBe(true);
      expect(error).toMatchObject({ code: "VALIDATION_ERROR" });
    }
  });
});
