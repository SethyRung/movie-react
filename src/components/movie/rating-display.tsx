import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RatingDisplayProps = {
  voteAverage: number;
  voteCount?: number;
  size?: "sm" | "md";
};

export function RatingDisplay({ voteAverage, voteCount, size = "sm" }: RatingDisplayProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-sm font-mono tracking-[0.6px]", size === "md" && "h-6 px-2.5")}
    >
      <StarIcon data-icon="inline-start" />
      {voteAverage.toFixed(1)}
      {voteCount != null ? ` (${voteCount.toLocaleString()})` : null}
    </Badge>
  );
}
