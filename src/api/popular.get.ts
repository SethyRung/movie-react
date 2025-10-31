import { isAxiosError } from "axios";
import { withApiKey } from "../utils/axios";

type ResponseBody = {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }[];
  total_pages: number;
  total_results: number;
};

const getPopular = async (page: number = 1): Promise<ResponseBody | undefined> => {
  try {
    const res = await withApiKey.get(`/movie/popular?language=en-US&page=${page}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data.status_message);
    return undefined;
    }
  }
};

export default getPopular;
export type { ResponseBody };
