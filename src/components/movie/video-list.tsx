import { MovieCarousel } from "@/components/movie/movie-carousel";
import { VideoThumbnail } from "@/components/movie/video-thumbnail";
import type { MovieVideo } from "@/services/movie/validation";

export type VideoListProps = {
  videos: MovieVideo[];
};

export function VideoList({ videos }: VideoListProps) {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube" && video.key);
  if (youtubeVideos.length === 0) return null;

  return (
    <MovieCarousel title="Videos">
      {youtubeVideos.map((video) => (
        <VideoThumbnail key={video.id} video={video} />
      ))}
    </MovieCarousel>
  );
}
