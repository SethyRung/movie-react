import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const MovieCard = ({
  id,
  images,
  title,
  release,
  language,
  rating,
}: {
  id: number;
  images: string;
  title: string;
  release: string;
  language: string;
  rating: string;
}) => {
  return (
    <div className="w-full h-full p-2">
      <img src={images} alt={`${title} Image`} className="w-full h-[60%] mb-4 object-cover" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <h1 className="text-white font-redHatMono text-sm font-bold line-clamp-2 h-10">
            {title}
          </h1>
          <div className="w-fit h-fit px-2 py-1 font-roboto text-[#FFA100] bg-[#FFA100]/10 text-xs rounded-2xl flex justify-between items-center gap-1">
            <Icon icon="mdi-star" />
            <span>{rating}</span>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] grid-rows-2 text-xs font-roboto gap-y-2 gap-x-3">
          <p className="text-grey-500">Release :</p>
          <p className="text-gray-400">{release}</p>
          <p className="text-grey-500">Language :</p>
          <p className="text-gray-400">{language}</p>
        </div>
        {/* <Link
          to=""
          className="w-full h-8 text-white border border-primary-500 rounded bg-primary-500/15 hover:border-2 transition-all flex items-center justify-center gap-2 text-xs tablet:text-base">
          <Icon icon="mdi-ticket-confirmation" width="16" />
          Get Tickets
        </Link> */}
        <Link
          to={`/movies/${id}`}
          className="w-full h-8 text-white rounded bg-primary-500 hover:bg-primary-600 transition-all flex items-center justify-center gap-2 text-xs tablet:text-base">
          <Icon icon="mdi-eye" width="16" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
