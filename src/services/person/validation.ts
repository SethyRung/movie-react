import { z } from "zod";

export const PersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  biography: z.string(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  place_of_birth: z.string().nullable(),
  profile_path: z.string().nullable(),
  known_for_department: z.string(),
  popularity: z.number(),
  also_known_as: z.array(z.string()).optional(),
});

export type Person = z.infer<typeof PersonSchema>;
