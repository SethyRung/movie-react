import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { useWatchlist } from "@/hooks/useWatchlist";

const navLinks = [
  { href: "/", label: "Home", icon: "lucide:house" },
  { href: "/movies", label: "Movies", icon: "lucide:film" },
  { href: "/watchlist", label: "Watchlist", icon: "lucide:bookmark" },
];

function SearchBar({ inputRef }: { inputRef?: React.RefObject<HTMLInputElement | null> }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounceValue(query, 300);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (debouncedQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
        setQuery("");
      }
    },
    [debouncedQuery, navigate],
  );

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Icon
        icon="lucide:search"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 h-9 bg-muted/50 border-transparent focus:border-input focus:bg-background transition-colors"
      />
    </form>
  );
}

function NavLink({
  href,
  label,
  icon,
  isActive,
  badge,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  isActive?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`flex items-center gap-3 min-h-11 py-2 text-sm font-medium transition-colors ${
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon icon={icon} className="w-5 h-5" />
      <span>{label}</span>
      {badge ? (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function DesktopNav({ pathname, watchlistCount }: { pathname: string; watchlistCount: number }) {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {navLinks.map(({ href, label, icon }) => (
        <NavLink
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={pathname === href || (href !== "/" && pathname.startsWith(href))}
          badge={href === "/watchlist" ? watchlistCount : undefined}
        />
      ))}
    </nav>
  );
}

function MobileNav({ pathname, watchlistCount }: { pathname: string; watchlistCount: number }) {
  return (
    <nav className="flex flex-col gap-4">
      {navLinks.map(({ href, label, icon }) => (
        <NavLink
          key={href}
          href={href}
          label={label}
          icon={icon}
          isActive={pathname === href || (href !== "/" && pathname.startsWith(href))}
          badge={href === "/watchlist" ? watchlistCount : undefined}
        />
      ))}
    </nav>
  );
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="w-11 h-11"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Icon icon="lucide:sun" className="w-4 h-4" />
      ) : (
        <Icon icon="lucide:moon" className="w-4 h-4" />
      )}
    </Button>
  );
}

function MobileThemeRow({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 min-h-11 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-left cursor-pointer"
    >
      <Icon icon={isDark ? "lucide:sun" : "lucide:moon"} className="w-5 h-5" />
      <span>Theme</span>
    </button>
  );
}

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const { watchlist } = useWatchlist();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground hover:text-accent transition-colors"
        >
          <Icon icon="lucide:film" className="w-6 h-6" />
          <span className="hidden sm:inline">CinePhil</span>
        </Link>

        <div className="flex-1 flex justify-center px-4 md:px-0">
          <div className="hidden md:block w-full max-w-md">
            <SearchBar inputRef={searchInputRef} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
          <DesktopNav pathname={pathname} watchlistCount={watchlist.length} />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="w-11 h-11">
                <Icon icon="lucide:menu" className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false} className="w-70 sm:w-[320px]">
              <div className="flex flex-col gap-6 pt-6 px-6 h-full">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="w-11 h-11 -mr-2">
                      <Icon icon="lucide:x" className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>
                <div className="md:hidden">
                  <SearchBar />
                </div>
                <MobileNav pathname={pathname} watchlistCount={watchlist.length} />
                <div className="md:hidden">
                  <MobileThemeRow isDark={isDark} onToggle={toggleTheme} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
