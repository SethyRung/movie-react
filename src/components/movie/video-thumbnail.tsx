import { PlayIcon } from "lucide-react";
import Image from "next/image";
import type { MovieVideo } from "@/services/movie/validation";

export type VideoThumbnailProps = {
  video: MovieVideo;
};

export function youtubeWatchUrl(key: string): string {
  return `https://www.youtube.com/watch?v=${key}`;
}

export function youtubeThumbUrl(key: string): string {
  return `https://i.ytimg.com/vi/${key}/hqdefault.jpg`;
}

export function VideoThumbnail({ video }: VideoThumbnailProps) {
  return (
    <a
      href={youtubeWatchUrl(video.key)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${video.name} (opens on YouTube)`}
      className="group flex w-72 shrink-0 snap-start flex-col gap-2 sm:w-80"
    >
      <div className="relative aspect-video overflow-hidden rounded-sm border border-border bg-card">
        <Image
          src={youtubeThumbUrl(video.key)}
          alt=""
          fill
          sizes="(max-width: 640px) 80vw, 320px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-hero/40 transition-colors group-hover:bg-hero/50"
        >
          <span className="bg-hero text-hero-foreground flex size-12 items-center justify-center rounded-full">
            <PlayIcon className="size-5" />
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
          {video.name}
        </h3>
        {video.type ? (
          <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            {video.type}
          </p>
        ) : null}
      </div>
    </a>
  );
}
