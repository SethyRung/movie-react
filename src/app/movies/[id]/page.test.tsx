import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/fetch-mock";
import { completeMovie, discoveryMovie, popularPage } from "@/test/fixtures/tmdb";
import MovieDetailPage from "./page";

async function renderMovie(id: string) {
  return renderToStaticMarkup(await MovieDetailPage({ params: Promise.resolve({ id }) }));
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("GET /movies/:id", () => {
  it("renders the movie title and a cast member name", async () => {
    mockFetch().handle(async (url) => {
      if (url.pathname === "/3/movie/27205") return jsonResponse(completeMovie());
      if (url.pathname === "/3/movie/27205/similar") {
        return jsonResponse(
          popularPage({ results: [discoveryMovie({ id: 1124, title: "The Prestige" })] }),
        );
      }
      if (url.pathname === "/3/movie/27205/recommendations") {
        return jsonResponse(
          popularPage({ results: [discoveryMovie({ id: 157336, title: "Interstellar" })] }),
        );
      }
      throw new Error(`unexpected path ${url.pathname}`);
    });

    const html = await renderMovie("27205");

    expect(html).toContain("Inception");
    expect(html).toContain("Leonardo DiCaprio");
    expect(html).toContain("The Prestige");
    expect(html).toContain("Interstellar");
    expect(html).toContain("/person/6193");
    expect(html).toContain("/movies/1124");
    expect(html).toContain("/movies/157336");
  });

  it("shows a not-found state for an invalid or missing movie id", async () => {
    const invalidHtml = await renderMovie("not-a-movie");
    expect(invalidHtml).toContain("Movie not found");
    expect(invalidHtml).not.toContain("Inception");

    mockFetch().error(404, "The resource you requested could not be found.");
    const missingHtml = await renderMovie("999999");
    expect(missingHtml).toContain("Movie not found");
    expect(missingHtml).not.toContain("Inception");
  });
});
