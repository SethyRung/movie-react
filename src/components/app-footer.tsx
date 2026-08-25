import { FilmIcon, GlobeIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { footerDiscover, site } from "@/lib/site";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto grid w-full max-w-340 gap-10 px-6 py-10 md:grid-cols-4 md:gap-12">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <FilmIcon className="size-5" />
            <span className="text-sm font-semibold text-white">{site.name}</span>
          </Link>
          <p className="mt-4 text-sm leading-6">{site.description} Your guide to cinema.</p>
        </div>

        <div>
          <h2 className="font-mono text-xs tracking-widest text-white uppercase">Discover</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {footerDiscover.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs tracking-widest text-white uppercase">Company</h2>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <Link href="/about" className="text-sm transition-colors hover:text-white">
                About
              </Link>
            </li>
            <li>
              <a
                href={site.tmdb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-white"
              >
                TMDB
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs tracking-widest text-white uppercase">Connect</h2>
          <div className="mt-4 flex gap-3">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="flex size-8 items-center justify-center rounded-sm border border-white/15 transition-colors hover:border-white/40 hover:text-white"
            >
              <GlobeIcon className="size-4" />
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-8 items-center justify-center rounded-sm border border-white/15 transition-colors hover:border-white/40 hover:text-white"
            >
              <GithubMark className="size-4" />
            </a>
          </div>
          <p className="mt-4 font-mono text-xs tracking-widest uppercase">
            Powered by{" "}
            <a
              href={site.tmdb}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors hover:text-white/80"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-340 px-6">
        <Separator className="bg-white/10" />
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs md:flex-row">
          <p>
            Data provided by{" "}
            <a
              href={site.tmdb}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              The Movie Database (TMDB)
            </a>
          </p>
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
