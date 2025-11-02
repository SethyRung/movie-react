import { useEffect, useRef, useState } from "react";
import MainCard from "../components/movie/main-card";
import MovieCard from "../components/movie/movie-card";
import Tabs from "../components/tabs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { movieAPI } from "../services";
import { isSuccessResponse } from "../services/base/ServiceResponse";
import { DiscoveryMovie, DiscoveryPaginatedResponse } from "@/services/discovery/validation";

type MovieImage = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1?: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
};

export default function Index() {
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

  const [mainMovie, setMainMovie] = useState<DiscoveryMovie & { images?: { posters: MovieImage[]; backdrops: MovieImage[] } } | undefined>(undefined);
  const [movieList, setMovieList] = useState<DiscoveryPaginatedResponse>();


  useEffect(() => {
    const loadData = async () => {
      const response = await movieAPI.discovery.getMainMovie({ includeImages: true });
      if (isSuccessResponse(response) && response.data.popular?.results?.length > 0) {
        const firstMovie = response.data.popular.results[0];
        // Add images to the movie object from the response
        const movieWithImages = {
          ...firstMovie,
          images: response.data.images || { posters: [], backdrops: [] }
        };
        setTimeout(() => setMainMovie(movieWithImages), 0);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadMovieList = async () => {
      let response;
      if (currentTab === "nowPlaying") {
        response = await movieAPI.discovery.getNowPlayingMovies();
      } else if (currentTab === "upcoming") {
        response = await movieAPI.discovery.getUpcomingMovies();
      } else {
        response = await movieAPI.discovery.getPopularMovies();
      }

      if (isSuccessResponse(response)) {
        setTimeout(() => setMovieList(response.data), 0);
      }
    };

    loadMovieList();
  }, [currentTab]);

  return (
    <div className="w-full p-4 tablet:px-16 desktop:px-52">
      {mainMovie && (
        <MainCard
          id={mainMovie.id}
          genre={""}
          title={mainMovie.original_title}
          overview={mainMovie.overview}
          images={mainMovie.images.posters
            .map((img) => "https://image.tmdb.org/t/p/original" + img.file_path)
            .slice(0, 6)}
        />
      )}
      <div className="flex justify-between items-center gap-8">
        <Tabs
          items={tabs}
          currentTab={currentTab}
          ui={{ wrapper: "lgMobile:w-fit" }}
          onCurrentTabChange={(vlaue) => setCurrentTab(vlaue)}
        />
        <div className="h-[1px] grow border border-grey-500 rounded hidden lgMobile:block"></div>
        <div className="hidden lgMobile:flex lgMobile:gap-2">
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
        {movieList?.results.map((movie) => (
          <div className="w-52 flex-shrink-0 bg-secondary-500" key={movie.id}>
            <MovieCard
              id={movie.id}
              images={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              title={movie.original_title}
              release={movie.release_date}
              rating={movie?.vote_average.toFixed(2)}
              language={movie.original_language.toLocaleUpperCase()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
