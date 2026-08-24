"use client";

import dynamic from "next/dynamic";

const ScrollSmootherRuntime = dynamic(() => import("./scroll-smoother-runtime"), {
  ssr: false,
});

export function ScrollSmootherHost() {
  return <ScrollSmootherRuntime />;
}
