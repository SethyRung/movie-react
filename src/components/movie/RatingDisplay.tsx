import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

export type RatingDisplayProps = {
  voteAverage: number;
  voteCount: number;
  size?: "sm" | "md";
};

export function RatingDisplay({ voteAverage, voteCount, size = "sm" }: RatingDisplayProps) {
  return (
    <Badge variant="secondary" className={size === "sm" ? "text-xs" : "text-sm"}>
      <Icon icon="lucide:star" className={size === "sm" ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1"} />
      {voteAverage.toFixed(1)} ({voteCount.toLocaleString()})
    </Badge>
  );
}
