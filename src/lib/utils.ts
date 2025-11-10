import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const mergeUI = <T extends object>(defaultUI: T, ui?: T): T => {
  if (!ui) return defaultUI;
  for (const key in defaultUI) {
    const defaultValue = defaultUI[key];
    const uiValue = ui[key];

    if (typeof defaultValue === "string") {
      ui[key] = twMerge(defaultValue, uiValue as string) as T[Extract<keyof T, string>];
    } else if (typeof defaultValue === "object") {
      ui[key] = mergeUI(defaultValue as object, uiValue as object) as T[Extract<keyof T, string>];
    }
  }

  return ui;
};

export { mergeUI };