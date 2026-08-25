"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type MovieCarouselProps = {
  title: string;
  href?: string;
  children: ReactNode;
};

export function MovieCarousel({ title, href, children }: MovieCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
          {href ? (
            <Link href={href} className="text-muted-foreground hover:text-foreground text-sm">
              See all
            </Link>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeftIcon />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollByPage(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </header>
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
      >
        {children}
      </div>
    </section>
  );
}
