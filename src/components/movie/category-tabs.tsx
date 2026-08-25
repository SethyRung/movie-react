import Link from "next/link";
import { DISCOVERY_KINDS, moviesListHref } from "@/lib/discovery-list";
import { cn } from "@/lib/utils";
import type { ListKind } from "@/services/discovery/queries";

export type CategoryTabsProps = {
  value: ListKind;
};

export function CategoryTabs({ value }: CategoryTabsProps) {
  return (
    <nav aria-label="Discovery category" className="flex flex-wrap gap-2">
      {DISCOVERY_KINDS.map(({ kind, label }) => {
        const active = kind === value;
        return (
          <Link
            key={kind}
            href={moviesListHref(kind)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-sm px-3.5 py-2 text-[14px] leading-5 transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-card",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
