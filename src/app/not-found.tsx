import type { Metadata } from "next";
import { HouseIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-340 flex-col justify-end px-6 py-18">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">404</p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-none font-medium tracking-tight md:text-6xl md:tracking-tighter">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="mt-8 w-fit min-h-11 px-4">
        <Link href="/">
          <HouseIcon data-icon="inline-start" />
          Back to home
        </Link>
      </Button>
    </section>
  );
}
