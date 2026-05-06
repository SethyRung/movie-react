import React from "react";
import { cn } from "../../../lib/utils";

export interface LoadingSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse" | "bars" | "skeleton" | "ripple";
  color?: "primary" | "secondary" | "tertiary" | "white";
  speed?: "slow" | "normal" | "fast";
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = "md",
  variant = "default",
  color = "primary",
  speed = "normal",
  label,
}) => {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const dotSizeClasses = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const barSizeClasses = {
    xs: "h-2 w-0.5",
    sm: "h-3 w-0.5",
    md: "h-4 w-0.5",
    lg: "h-6 w-0.5",
    xl: "h-8 w-0.5",
  };

  const colorClasses = {
    primary: "text-primary border-primary bg-primary",
    secondary: "text-secondary-500 border-secondary-500 bg-secondary-500",
    tertiary: "text-tertiary-500 border-tertiary-500 bg-tertiary-500",
    white: "text-white border-white bg-white",
  };

  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn(
                "animate-bounce rounded-full",
                colorClasses[color].split(" ")[2], // bg class
                dotSizeClasses[size],
                speed === "slow"
                  ? "animate-bounce-slow"
                  : speed === "fast"
                    ? "animate-bounce-fast"
                    : "",
              )}
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: speed === "slow" ? "1.4s" : speed === "fast" ? "0.8s" : "1.1s",
              }}
            />
          ))}
        </div>
        {label && <span className="text-sm text-muted-foreground ml-2">{label}</span>}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <div className="flex space-x-0.5">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={cn(
                "bg-current rounded-full",
                colorClasses[color].split(" ")[0], // text class
                barSizeClasses[size],
                speed === "slow"
                  ? "animate-pulse-slow"
                  : speed === "fast"
                    ? "animate-pulse-fast"
                    : "animate-pulse",
              )}
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: speed === "slow" ? "2s" : speed === "fast" ? "0.8s" : "1.4s",
              }}
            />
          ))}
        </div>
        {label && <span className="text-sm text-muted-foreground ml-2">{label}</span>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "animate-pulse rounded-full",
            colorClasses[color].split(" ")[2], // bg class
            sizeClasses[size],
            speed === "slow" ? "animate-pulse-slow" : speed === "fast" ? "animate-pulse-fast" : "",
          )}
          style={{
            animationDuration: speed === "slow" ? "3s" : speed === "fast" ? "1s" : "2s",
          }}
        />
        {label && <span className="text-sm text-muted-foreground ml-3">{label}</span>}
      </div>
    );
  }

  if (variant === "skeleton") {
    const skeletonVariants = {
      xs: "h-4 w-16",
      sm: "h-5 w-24",
      md: "h-6 w-32",
      lg: "h-8 w-48",
      xl: "h-10 w-64",
    };

    return (
      <div className={cn("flex items-center", className)}>
        <div
          className={cn("animate-pulse rounded bg-muted", skeletonVariants[size])}
          style={{
            animationDuration: speed === "slow" ? "3s" : speed === "fast" ? "1s" : "2s",
          }}
        />
        {label && <span className="text-sm text-muted-foreground ml-3">{label}</span>}
      </div>
    );
  }

  if (variant === "ripple") {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <div
          className={cn(
            "animate-ping rounded-full opacity-75",
            colorClasses[color].split(" ")[2], // bg class
            sizeClasses[size],
          )}
        />
        <div
          className={cn(
            "absolute rounded-full",
            colorClasses[color].split(" ")[2], // bg class
            sizeClasses[size],
          )}
        />
        {label && <span className="text-sm text-muted-foreground ml-3">{label}</span>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-transparent border-t-current",
          colorClasses[color].split(" ")[0], // text class
          sizeClasses[size],
          speedClasses[speed],
        )}
        style={{
          animationDuration: speed === "slow" ? "2s" : speed === "fast" ? "0.6s" : "1s",
        }}
      />
      {label && <span className="text-sm text-muted-foreground ml-3">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
