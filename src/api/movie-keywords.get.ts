import { isAxiosError } from "axios";
import { withApiKey } from "../utils/axios";

type ResponseBody = {
  id: number;
  keywords: {
    id: number;
    name: string;
  }[];
};

const getKeywords = async (movie_id: number): Promise<ResponseBody | undefined> => {
  try {
    const res = await withApiKey.get(`/movie/${movie_id}/keywords`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data.status_message);
    return undefined;
    }
  }
};

export default getKeywords;
export type { ResponseBody };
