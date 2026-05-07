import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  discover: [
    { href: "/movies", label: "Popular Movies" },
    { href: "/movies?sort=top_rated", label: "Top Rated" },
    { href: "/movies?sort=upcoming", label: "Upcoming" },
    { href: "/movies?sort=now_playing", label: "Now Playing" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "https://www.themoviedb.org", label: "TMDB", external: true },
  ],
};

const socialLinks = [
  { href: "https://twitter.com", label: "Twitter", icon: "simple-icons:twitter" },
  { href: "https://github.com", label: "GitHub", icon: "simple-icons:github" },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground hover:text-accent transition-colors"
            >
              <Icon icon="lucide:film" className="w-6 h-6" />
              <span>CinePhil</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Discover movies with an editorial perspective. Your guide to cinema.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Discover</h4>
            <ul className="space-y-3">
              {footerLinks.discover.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(({ href, label, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
                  aria-label={label}
                >
                  <Icon icon={icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Powered by{" "}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                TMDB
              </a>
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            Data provided by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              The Movie Database (TMDB)
            </a>
          </p>
          <p>&copy; {new Date().getFullYear()} CinePhil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
