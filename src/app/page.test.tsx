import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/fetch-mock";
import { discoveryMovie, popularPage } from "@/test/fixtures/tmdb";
import Home from "./page";

describe("GET /", () => {
  it("renders each discovery section from mocked TMDB lists", async () => {
    mockFetch().json(
      popularPage({
        results: [discoveryMovie({ id: 27205, title: "Inception" })],
      }),
    );

    const html = renderToStaticMarkup(await Home());

    expect(html).toContain(">Popular<");
    expect(html).toContain("Now Playing");
    expect(html).toContain("Upcoming");
    expect(html).toContain("Top Rated");
    expect(html).toContain("Inception");
    expect(html).toContain("/movies/27205");
  });

  it("omits a discovery section when that list request fails", async () => {
    const page = popularPage({
      results: [discoveryMovie({ id: 27205, title: "Inception" })],
    });

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

    const html = renderToStaticMarkup(await Home());

    expect(html).toContain(">Popular<");
    expect(html).toContain("Now Playing");
    expect(html).toContain("Top Rated");
    expect(html).not.toContain(">Upcoming<");
  });

  it("renders a fallback when every discovery list fails", async () => {
    mockFetch().error(500, "boom");

    const html = renderToStaticMarkup(await Home());

    expect(html).toContain("Could not load discovery lists");
    expect(html).not.toContain(">Popular<");
    expect(html).not.toContain("/movies/27205");
  });
});
