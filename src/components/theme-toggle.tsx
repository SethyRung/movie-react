"use client";

import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useSyncExternalStore } from "react";

import { Moon, Sun } from "lucide";
import { MorphIcon } from "@/components/morph-icon";

import { Button } from "@/components/ui/button";

function subscribeDark(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function useIsDark() {
  const isDark = useSyncExternalStore(
    subscribeDark,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  return { isDark };
}

function toggleTheme(theme: string | undefined, setTheme: Dispatch<SetStateAction<string>>) {
  const isDark = theme === "dark";
  setTheme(isDark ? "light" : "dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { isDark } = useIsDark();

  return (
    <Button variant="ghost" className={className} onClick={() => toggleTheme(theme, setTheme)}>
      <MorphIcon icon={isDark ? Sun : Moon} />
    </Button>
  );
}

export function ThemeToggleRow({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { isDark } = useIsDark();

  return (
    <Button variant="ghost" className={className} onClick={() => toggleTheme(theme, setTheme)}>
      <MorphIcon icon={isDark ? Sun : Moon} />

      <span>Appearance</span>

      <span className="text-muted-foreground ml-auto font-mono text-xs tracking-widest uppercase">
        {isDark ? "Dark" : "Light"}
      </span>
    </Button>
  );
}
