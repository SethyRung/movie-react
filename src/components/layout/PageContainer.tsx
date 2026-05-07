import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  as?: "main" | "section" | "div";
}

export default function PageContainer({
  children,
  className,
  as: Component = "section",
}: PageContainerProps) {
  return (
    <Component className={cn("container mx-auto px-4 py-6 md:py-8", className)}>
      {children}
    </Component>
  );
}
