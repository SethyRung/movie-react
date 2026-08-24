export const site = {
  name: "CinePhil",
  description: "Discover movies with an editorial perspective.",
  url: "https://sethyrung.com",
  github: "https://github.com/SethyRung/movie-react",
  tmdb: "https://www.themoviedb.org",
} as const;

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/watchlist", label: "Watchlist" },
] as const;

export const footerDiscover = [
  { href: "/movies", label: "Popular Movies" },
  { href: "/movies?kind=topRated", label: "Top Rated" },
  { href: "/movies?kind=upcoming", label: "Upcoming" },
  { href: "/movies?kind=nowPlaying", label: "Now Playing" },
] as const;
