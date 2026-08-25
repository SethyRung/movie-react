import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type RatingDisplayProps = {
  voteAverage: number;
  voteCount?: number;
  size?: "sm" | "md";
  className?: string;
};

export function RatingDisplay({
  voteAverage,
  voteCount,
  size = "sm",
  className,
}: RatingDisplayProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-sm bg-hero px-2 font-mono text-[11px] tracking-[0.6px] text-hero-foreground",
        size === "md" && "h-6 px-2.5 text-xs",
        className,
      )}
    >
      <StarIcon className="size-3" />
      {voteAverage.toFixed(1)}
      {voteCount != null ? ` (${voteCount.toLocaleString()})` : null}
    </span>
  );
}
