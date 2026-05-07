import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { VideoThumbnail } from "./VideoThumbnail";
import type { MovieVideo } from "@/services/movie/validation";

export type VideoListProps = {
  videos: MovieVideo[];
};

export function VideoList({ videos }: VideoListProps) {
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");
  if (youtubeVideos.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Videos</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {youtubeVideos.map((video) => (
            <VideoThumbnail key={video.id} video={video} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
