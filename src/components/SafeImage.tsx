import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackClassName?: string;
};

export function SafeImage({ className, fallbackClassName, alt = "", ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-sm",
          fallbackClassName || className,
        )}
        role="img"
        aria-label={alt}
      >
        <span className="sr-only">{alt}</span>
        No Image
      </div>
    );
  }

  return (
    <img {...props} alt={alt} className={className} onError={() => setError(true)} loading="lazy" />
  );
}
