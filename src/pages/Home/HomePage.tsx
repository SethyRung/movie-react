import { useRef, useState } from "react";
import { MainCard, MovieCard } from "@features/movies";
import Tabs from "@/components/tabs";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  useMainMovie,
  useNowPlayingMovies,
  useUpcomingMovies,
  usePopularMovies,
} from "@features/movies/hooks";
import { DiscoveryMovie } from "@/services/discovery/validation";

export default function HomePage() {
  const tabs = [
    {
      title: "Now Playing",
      key: "nowPlaying",
    },
    {
      title: "Coming Soon",
      key: "upcoming",
    },
    {
      title: "Popular",
      key: "popular",
    },
  ];

  const [currentTab, setCurrentTab] = useState<string>("nowPlaying");

  const parentMovieCardRef = useRef<HTMLDivElement>(null);
  const scrollTo = (scrollTo: "ToLeft" | "ToRight") => {
    if (parentMovieCardRef.current) {
      const cardWidth = (parentMovieCardRef.current.firstChild as HTMLElement).offsetWidth;
      const scrollLeft = parentMovieCardRef.current.scrollLeft;
      let delta = scrollTo === "ToRight" ? cardWidth : -cardWidth;
      if (scrollLeft === 0) delta = delta + 16;

      parentMovieCardRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  // Custom hooks for data fetching
  const { data: mainMovieData, isLoading: mainLoading } = useMainMovie();
  const { data: nowPlayingData } = useNowPlayingMovies();
  const { data: upcomingData } = useUpcomingMovies();
  const { data: popularData } = usePopularMovies();

  // Select the correct movie list based on current tab
  const getMovieList = () => {
    switch (currentTab) {
      case "nowPlaying":
        return nowPlayingData;
      case "upcoming":
        return upcomingData;
      case "popular":
        return popularData;
      default:
        return nowPlayingData;
    }
  };

  const movieList = getMovieList();

  // Transform main movie data for MainCard
  const mainMovie = mainMovieData &&
    mainMovieData.popular?.results?.[0] && {
      id: mainMovieData.popular.results[0].id,
      genre: "", // API doesn't include genre names directly
      title: mainMovieData.popular.results[0].original_title,
      overview: mainMovieData.popular.results[0].overview,
      images:
        mainMovieData.images?.posters
          ?.slice(0, 6)
          ?.map(
            (img: { file_path: string }) => `https://image.tmdb.org/t/p/original${img.file_path}`
          ) || [],
    };

  return (
    <div className="w-full p-4 md:px-16 lg:px-52">
      {mainMovie && !mainLoading && (
        <MainCard
          id={mainMovie.id}
          genre={mainMovie.genre}
          title={mainMovie.title}
          overview={mainMovie.overview || ""}
          images={mainMovie.images}
        />
      )}

      <div className="flex justify-between items-center gap-8">
        <Tabs
          items={tabs}
          currentTab={currentTab}
          ui={{ wrapper: "sm:w-fit" }}
          onCurrentTabChange={(value: string) => setCurrentTab(value)}
        />
        <div className="h-[1px] grow border border-grey-500 rounded hidden sm:block"></div>
        <div className="hidden sm:flex sm:gap-2">
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

      <div
        className="w-full h-fit bg-tertiary-500 p-4 flex overflow-x-scroll"
        ref={parentMovieCardRef}>
        {movieList?.results?.map((movie: DiscoveryMovie) => (
          <div className="w-52 flex-shrink-0 bg-secondary-500" key={movie.id}>
            <MovieCard
              id={movie.id}
              images={
                movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : ""
              }
              title={movie.original_title}
              release={movie.release_date}
              rating={movie?.vote_average?.toFixed(2) || "0.0"}
              language={movie.original_language?.toLocaleUpperCase() || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
