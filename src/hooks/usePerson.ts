import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axios";

export type Person = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as?: string[];
};

export function usePerson(id: number) {
  return useQuery<Person>({
    queryKey: ["person", id],
    queryFn: async () => {
      const response = await api.get<Person>(`/person/${id}`);
      return response.data;
    },
    enabled: id > 0,
  });
}
