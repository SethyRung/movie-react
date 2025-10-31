import { isAxiosError } from "axios";
import { withApiKey } from "../utils/axios";

type ResponseBody = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

const getMovieDetail = async (movie_id: number): Promise<ResponseBody | undefined> => {
  try {
    const res = await withApiKey.get(`/movie/${movie_id}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data.status_message);
    return undefined;
    }
  }
};

export default getMovieDetail;
export type { ResponseBody };
