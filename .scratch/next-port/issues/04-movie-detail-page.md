# 04: Movie detail page

**What to build:** The `/movies/[id]` route as a Server Component that calls `getCompleteMovieData` (with credits, images, videos appended) plus similar movies and recommendations, then renders the movie hero, metadata, cast, and videos. Ports `MovieHero`, `MovieMeta`, `CastList`/`CastCard`, `VideoList`/`VideoThumbnail`, and `RatingDisplay`, reusing `MovieCarousel`/`MovieCard` (from ticket 02) for the similar/recommendations rails. The page is fully server-rendered with rich metadata for crawlability.

**Blocked by:** 02 (home page + shared movie display components)

**Status:** ready-for-agent

- [ ] `/movies/[id]` renders hero, genres, runtime, rating, cast, and videos from a single `getCompleteMovieData` call
- [ ] Similar movies and recommendations rails render using the shared carousel/card
- [ ] A missing/invalid movie id shows a not-found-style error state, not a crash
- [ ] An HTTP route test asserts the page HTML contains the movie title and a cast member name
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
