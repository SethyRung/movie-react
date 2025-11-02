import { Icon } from "@iconify/react/dist/iconify.js";
import { CastCard } from "@features/movies";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMovieDetails, useMovieCredits, useMovieVideos } from "@features/movies/hooks";
import { MovieVideo, CastMember, CrewMember } from "@/services/movie/validation";

export default function MovieDetailPage() {
  const { id: movieId } = useParams();

  // Use custom hooks for data fetching
  const { data: movie, isLoading: movieLoading } = useMovieDetails(parseInt(movieId || '0'));
  const { data: credits } = useMovieCredits(parseInt(movieId || '0'));
  const { data: videos } = useMovieVideos(parseInt(movieId || '0'));

  // Find trailer URL
  const trailer = videos?.results?.find(
    (v: MovieVideo) => v.site === "YouTube" && v.type === "Trailer"
  );
  const movieTrailerURL = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : "";

  const castCardRef = useRef<HTMLDivElement>(null);

  const scrollTo = (scrollTo: "ToLeft" | "ToRight") => {
    if (castCardRef.current) {
      const cardWidth = (castCardRef.current.firstChild as HTMLElement).offsetWidth;
      const gap = parseInt(window.getComputedStyle(castCardRef.current).columnGap, 10);

      const delta = scrollTo === "ToRight" ? cardWidth + gap : -(cardWidth + gap);
      castCardRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  if (movieLoading || !movie) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 tablet:px-16 desktop:px-52">
      <div className="p-4 bg-tertiary-500 rounded-lg flex flex-col tablet:flex-row tablet:gap-4">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
          alt={`${movie?.original_title}_Poster`}
          className="w-[320px] max-h-72 mx-auto object-cover rounded-lg"
        />
        <div>
          <div className="mt-4 mb-6">
            <h1 className="text-white text-2xl font-bold font-redHatText">
              {movie?.original_title}
            </h1>
            <p className="text-grey-500 text-sm font-redHatText mt-2">
              {`${movie?.release_date} (${movie?.original_language?.toUpperCase() || ''}) ${movie?.genres?.map((m: { name: string }) => m.name).join(", ")} ${movie?.runtime && Math.floor(movie?.runtime / 60)}h ${movie?.runtime && Math.floor(movie?.runtime % 60)}mn`}
            </p>
          </div>
          <div className="flex items-center gap-7">
            <div className="w-16 h-16 flex justify-center items-center border-[4px] border-primary-500 rounded-full text-white text-lg font-bold font-redHatMono">
              <sup>{movie?.vote_average ? Math.ceil(movie?.vote_average) : 0}</sup>/<sub>10</sub>
            </div>
            <Link
              to={movieTrailerURL}
              target="_blank"
              className="p-2 bg-primary-500/30 rounded text-white flex items-center gap-2">
              <Icon icon="mdi-play-circle" />
              <span className="font-redHatText text-base font-bold">Play Trailer</span>
            </Link>
          </div>
          <div className="text-white my-6">
            <h2 className="font-redHatText font-bold text-base">Overview</h2>
            <p className="mt-2 text-sm text-grey-500 text-justify">{movie?.overview}</p>
          </div>
          <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4">
            {credits?.crew?.map(
              (c: CrewMember, i: number) =>
                i < 12 && (
                  <div className="w-full break-all" key={`${i}-${c.name}`}>
                    <h2 className="text-white font-redHatText font-bold text-sm mb-2">{c.name}</h2>
                    <h2 className="text-grey-500 text-xs">{c.job || c.department}</h2>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 mb-4 flex justify-between items-center gap-8">
        <div className="flex items-center text-white font-roboto text-2xl font-bold">
          <Icon icon="mdi-account" />
          <h1>Cast</h1>
        </div>
        <div className="h-[1px] grow border border-grey-500 rounded"></div>
        <div className="flex gap-2">
          <button
            className="p-1.5 w-8 h-8 focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium text-left break-all line-clamp-1 inline-flex justify-center items-center text-sm gap-x-1.5 rounded-full shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
            onClick={() => scrollTo("ToLeft")}>
            <Icon icon="mdi-chevron-left" />
          </button>
          <button
            className="p-1.5 w-8 h-8 focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium text-left break-all line-clamp-1 inline-flex justify-center items-center text-sm gap-x-1.5 rounded-full shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400"
            onClick={() => scrollTo("ToRight")}>
            <Icon icon="mdi-chevron-right" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 tablet:gap-4 my-8">
        <div
          className="w-full h-fit pb-4 flex gap-4 overflow-x-scroll overflow-y-hidden"
          ref={castCardRef}>
          {credits?.cast?.map((c: CastMember, i: number) => (
            <CastCard
              profile={c.profile_path ? `https://image.tmdb.org/t/p/original/${c.profile_path}` : null}
              name={c.name}
              character={c.character || ''}
              key={`${i}-${c.name}`}
            />
          ))}
        </div>
        <div className="w-full h-full p-4 bg-tertiary-500 rounded grid grid-cols-1 gap-6 lgMobile:grid-cols-2 lgMobile:gap-0">
          <div className="grid gap-3">
            <div className="font-redHatText font-bold">
              <h1 className="text-white text-sm mb-1">Status</h1>
              <p className="text-grey-500 text-xs">{movie?.status}</p>
            </div>
            <div className="font-redHatText font-bold">
              <h1 className="text-white text-sm mb-1">Original Language</h1>
              <p className="text-grey-500 text-xs">{movie?.original_language?.toUpperCase() || ''}</p>
            </div>
            <div className="font-redHatText font-bold">
              <h1 className="text-white text-sm mb-1">Revenue</h1>
              <p className="text-grey-500 text-xs">
                {movie?.revenue &&
                  Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                    movie?.revenue
                  )}
              </p>
            </div>
            <div className="font-redHatText font-bold">
              <h1 className="text-white text-sm mb-1">Budget</h1>
              <p className="text-grey-500 text-xs">
                {movie?.budget &&
                  Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                    movie?.budget
                  )}
              </p>
            </div>
          </div>
          <div className="font-redHatText font-bold text-white text-sm">
            <h1>Genres</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.isArray(movie?.genres) && movie?.genres.slice(0, 6).map((genre: { id: number; name: string }) => (
                <div className="w-fit py-2 px-4 bg-secondary-500 rounded-md" key={genre.id}>
                  {genre.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}