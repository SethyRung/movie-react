"use client";

import { MorphIcon as MorphIconPrimitive, type MorphIconProps } from "morphicons/react";

export function MorphIcon({ reducedMotion = "user", spring = "snappy", ...props }: MorphIconProps) {
  return <MorphIconPrimitive reducedMotion={reducedMotion} spring={spring} {...props} />;
}
