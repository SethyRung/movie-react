import { useQuery } from "@tanstack/react-query";
import { getPerson } from "@/services/person/queries";
import type { Person } from "@/services/person/validation";

export function usePerson(id: number) {
  return useQuery<Person>({
    queryKey: ["person", id],
    queryFn: () => getPerson(id),
    enabled: id > 0,
  });
}
