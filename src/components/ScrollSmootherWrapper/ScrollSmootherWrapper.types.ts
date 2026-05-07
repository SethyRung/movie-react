import { type ReactNode } from "react";

export interface ScrollSmootherWrapperProps {
  children: ReactNode;
  smooth?: number;
  effects?: boolean;
  normalizeScroll?: boolean;
  ignoreMobileResize?: boolean;
  smoothTouch?: boolean;
  enabled?: boolean;
  className?: string;
}

export interface ScrollSmootherOptions {
  smooth?: number;
  effects?: boolean;
  normalizeScroll?: boolean;
  ignoreMobileResize?: boolean;
  smoothTouch?: boolean;
  onUpdate?: (self: any) => void;
  onStart?: (self: any) => void;
  onStop?: (self: any) => void;
}
