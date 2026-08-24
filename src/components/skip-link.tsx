export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-primary text-primary-foreground focus:fixed focus:top-2 focus:left-2 focus:z-[100] sr-only rounded-sm px-4 py-2 focus:not-sr-only"
    >
      Skip to content
    </a>
  );
}
