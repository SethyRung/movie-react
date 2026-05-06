import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export interface MovieData {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
  vote_count?: number;
  adult?: boolean;
}

export interface MovieCardProps {
  id: number;
  images: string;
  title: string;
  release: string;
  language: string;
  rating: string;
  className?: string;
  onImageLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function AnimatedMovieCard({
  id,
  images,
  title,
  release,
  language,
  rating,
  onImageLoad,
  onError,
}: MovieCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (images) return images;
    return "/placeholder-movie.jpg";
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    onImageLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.(new Error(`Failed to load image for movie: ${title}`));
  };

  const formatRating = (rating: string) => rating;
  const releaseYear = (() => {
    try {
      return new Date(release).getFullYear();
    } catch {
      return null;
    }
  })();

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const image = card.querySelector(".movie-image") as HTMLImageElement;
    const playButton = card.querySelector(".play-button");
    const rating = card.querySelector(".rating-badge");
    const title = card.querySelector(".movie-title");

    // Initial load animation
    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out", delay: 0.1 },
    );

    let tl: gsap.core.Timeline | null = null;

    const handleMouseEnter = () => {
      // kill any existing timeline before starting a new one
      if (tl) tl.kill();

      tl = gsap.timeline();

      tl.to(card, {
        scale: 1.03,
        y: -8,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.4)",
      });

      if (image)
        tl.to(
          image,
          { scale: 1.08, duration: 0.5, ease: "power2.out" },
          "<", // start at same time
        );

      if (playButton)
        tl.to(playButton, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.2)" }, "<0.1");

      if (rating) tl.to(rating, { backgroundColor: "rgba(251, 191, 36, 0.2)", duration: 0.3 }, "<");

      if (title) tl.to(title, { color: "#8B5CF6", duration: 0.3, ease: "power2.out" }, "<");
    };

    const handleMouseLeave = () => {
      if (tl) {
        // smooth return to normal state
        tl.reverse();
      } else {
        // fallback (if user leaves too fast before tl exists)
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to([image, playButton, rating, title], {
          scale: 1,
          opacity: 1,
          color: "",
          backgroundColor: "",
          duration: 0.3,
        });
      }
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      if (tl) tl.kill();
    };
  });

  const imageUrl = imageError ? "/placeholder-movie.jpg" : getImageUrl();

  return (
    <div
      ref={cardRef}
      className="flex flex-col h-full"
      role="article"
      aria-label={`Movie: ${title}`}
    >
      <Link to={`/movies/${id}`} className="block h-full">
        <div className="relative group cursor-pointer h-full">
          <div className="relative h-full flex flex-col overflow-hidden rounded-xl bg-tertiary-900/80 backdrop-blur-sm border border-tertiary-700/30 transition-all duration-300 hover:border-primary-500/20">
            <div className="relative aspect-2/3 overflow-hidden bg-tertiary-800">
              <img
                className={`movie-image w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                src={imageUrl}
                alt={title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 342px"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-linear-to-br from-tertiary-800 to-tertiary-700 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
              {parseFloat(rating) > 0 && (
                <div
                  className="rating-badge absolute top-3 right-3 px-2.5 py-1.5 bg-black/80 backdrop-blur-sm rounded-full flex items-center gap-1.5 border border-white/10 transition-colors duration-300"
                  aria-label={`Rating: ${formatRating(rating)} out of 10`}
                >
                  <Icon icon="mdi-star" className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="text-xs font-semibold text-white">{formatRating(rating)}</span>
                </div>
              )}
              <div
                className="play-button absolute inset-0 flex items-center justify-center opacity-0 scale-90 pointer-events-none"
                aria-hidden="true"
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <Icon icon="mdi-play" className="w-6 h-6 text-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-linear-to-t from-black/90 to-black/60">
              <div className="space-y-2">
                <h3
                  className="movie-title font-semibold text-white text-sm line-clamp-2 leading-tight transition-colors duration-300"
                  title={title}
                >
                  {title}
                </h3>

                <div className="flex items-center justify-between text-xs text-grey-400">
                  <div className="flex items-center gap-2">
                    {releaseYear && <span className="font-medium">{releaseYear}</span>}
                    {language && (
                      <>
                        <span className="text-grey-600">•</span>
                        <span className="uppercase tracking-wide">{language}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
