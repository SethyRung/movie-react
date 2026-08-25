import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mockFetch } from "@/test/fetch-mock";
import { person } from "@/test/fixtures/tmdb";
import PersonDetailPage from "./page";

async function renderPerson(id: string) {
  return renderToStaticMarkup(await PersonDetailPage({ params: Promise.resolve({ id }) }));
}

describe("GET /person/:id", () => {
  it("renders the person's name from mocked TMDB data", async () => {
    mockFetch().json(person());

    const html = await renderPerson("6193");

    expect(html).toContain("Leonardo DiCaprio");
    expect(html).toContain("Acting");
    expect(html).toContain("Leonardo Wilhelm DiCaprio is an American actor and film producer.");
    expect(html).toContain("Los Angeles, California, USA");
  });

  it("shows a not-found state for an invalid or missing person id", async () => {
    const invalidHtml = await renderPerson("not-a-person");
    expect(invalidHtml).toContain("Person not found");
    expect(invalidHtml).not.toContain("Leonardo DiCaprio");

    mockFetch().error(404, "The resource you requested could not be found.");
    const missingHtml = await renderPerson("999999");
    expect(missingHtml).toContain("Person not found");
    expect(missingHtml).not.toContain("Leonardo DiCaprio");
  });
});
