import type { ReactNode } from "react";

export function ScrollSmootherWrapper({ children }: { children: ReactNode }) {
  return (
    <div id="smooth-wrapper" className="fixed inset-0 overflow-hidden">
      <div id="smooth-content" className="min-h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
