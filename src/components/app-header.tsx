"use client";

import { Menu, X } from "lucide";
import { BookmarkIcon, FilmIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeaderSearch } from "@/components/header-search";
import { MorphIcon } from "@/components/morph-icon";
import { ThemeToggle, ThemeToggleRow } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const navIcons = {
  "/": HouseIcon,
  "/movies": FilmIcon,
  "/watchlist": BookmarkIcon,
} as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
      {primaryNav.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-sm transition-colors",
            isActivePath(pathname, href)
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {primaryNav.map(({ href, label }) => {
        const Icon = navIcons[href];
        const active = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "px-2 py-2.5 flex items-center gap-3 rounded-sm  transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return <MorphIcon icon={open ? X : Menu} />;
}

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background border-b border-accent backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="max-w-340 px-6 py-3.5 mx-auto flex  items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <FilmIcon className="size-5" />
          <span className="hidden text-[15px] font-semibold tracking-[-0.26px] sm:inline">
            {site.name}
          </span>
        </Link>

        <DesktopNav pathname={pathname} />

        <div className="hidden flex-1 justify-center md:flex">
          <HeaderSearch />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle className="hidden md:inline-flex" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" onClick={() => setOpen(!open)}>
                <MenuGlyph open={open} />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" showCloseButton={false} className="bg-background">
              <SheetHeader className="gap-2">
                <div className="flex justify-between">
                  <SheetTitle>{site.name}</SheetTitle>

                  <SheetClose className="h-max">
                    <MenuGlyph open={open} />
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 px-4">
                <HeaderSearch />

                <MobileNav pathname={pathname} onNavigate={() => setOpen(false)} />
              </div>

              <SheetFooter>
                <Separator />
                <ThemeToggleRow />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
