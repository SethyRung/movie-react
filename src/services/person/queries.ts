import { request } from "@/services/tmdb";
import { PersonSchema } from "./validation";
import type { Person } from "./validation";

export async function getPerson(id: number, language = "en-US"): Promise<Person> {
  return request({ path: `/person/${id}`, params: { language } }, PersonSchema);
}
