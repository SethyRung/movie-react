import type { MovieVideo } from "@/services/movie/validation";

export type VideoThumbnailProps = {
  video: MovieVideo;
};

export function VideoThumbnail({ video }: VideoThumbnailProps) {
  return (
    <div className="shrink-0 w-72 md:w-96">
      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
        <iframe
          title={video.name}
          src={`https://www.youtube.com/embed/${video.key}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2 truncate">{video.name}</p>
    </div>
  );
}
