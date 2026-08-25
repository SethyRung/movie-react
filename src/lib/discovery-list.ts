import type { ListKind } from "@/services/discovery/queries";

export const DISCOVERY_KINDS = [
  { kind: "popular", label: "Popular" },
  { kind: "nowPlaying", label: "Now Playing" },
  { kind: "upcoming", label: "Upcoming" },
  { kind: "topRated", label: "Top Rated" },
] as const satisfies readonly { kind: ListKind; label: string }[];

const KIND_SET = new Set<ListKind>(DISCOVERY_KINDS.map(({ kind }) => kind));

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseListKind(value: string | string[] | undefined): ListKind {
  const raw = firstParam(value);
  return raw && KIND_SET.has(raw as ListKind) ? (raw as ListKind) : "popular";
}

export function parseListPage(value: string | string[] | undefined): number {
  const raw = firstParam(value);
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function listKindLabel(kind: ListKind): string {
  return DISCOVERY_KINDS.find((entry) => entry.kind === kind)?.label ?? "Popular";
}

export function moviesListHref(kind: ListKind, page = 1): string {
  const params = new URLSearchParams();
  if (kind !== "popular") params.set("kind", kind);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/movies?${query}` : "/movies";
}
