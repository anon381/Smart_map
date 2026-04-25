import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

type SearchResponse = {
  answer: string;
  sourceLocationsSearched: number;
  geofenced?: boolean;
};

export function useSearch() {
  return useMutation({
    mutationFn: async ({ query, userLat, userLng }: { query: string; userLat?: number; userLng?: number }) => {
      return apiRequest("/search/rag", {
        method: "POST",
        body: JSON.stringify({ query, userLat, userLng }),
      }) as Promise<SearchResponse>;
    },
  });
}
