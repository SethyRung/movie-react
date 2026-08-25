import { isServiceError } from "@/services/error";

export function parseRouteId(id: string): number | null {
  if (!/^\d+$/.test(id)) return null;
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function isNotFoundError(error: unknown): boolean {
  return isServiceError(error) && (error.code === "NOT_FOUND" || error.statusCode === 404);
}
