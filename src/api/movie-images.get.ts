import { isAxiosError } from "axios";
import { withApiKey } from "../utils/axios";

type ResponseBody = {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

const getImages = async (
  movie_id: number
): Promise<
  | { backdrops: ResponseBody[]; id: number; logos: ResponseBody[]; posters: ResponseBody[] }
  | undefined
> => {
  try {
    const res = await withApiKey.get(`/movie/${movie_id}/images?include_image_language=en`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data.status_message);
    return undefined;
    }
  }
};

export default getImages;
export type { ResponseBody };
