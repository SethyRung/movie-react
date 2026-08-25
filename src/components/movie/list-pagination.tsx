import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type ListPaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

export function ListPagination({ page, totalPages, hrefForPage }: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {previousPage ? (
        <Button asChild variant="outline" className="min-h-11 px-4">
          <Link href={hrefForPage(previousPage)}>
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="min-h-11 px-4" disabled>
          <ChevronLeftIcon data-icon="inline-start" />
          Previous
        </Button>
      )}

      <p className="text-muted-foreground px-3 font-mono text-xs tracking-widest uppercase">
        Page {page} of {totalPages}
      </p>

      {nextPage ? (
        <Button asChild variant="outline" className="min-h-11 px-4">
          <Link href={hrefForPage(nextPage)}>
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="min-h-11 px-4" disabled>
          Next
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      )}
    </nav>
  );
}
