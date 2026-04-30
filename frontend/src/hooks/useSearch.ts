import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";


export type RagResult = {
  name: string;
  lat: number;
  lng: number;
  id?: string;
  category?: string;
  distance?: number;
  trust_score?: number;
  source?: string;
  osm_url?: string;
  verification_status?: string;
};

export type RagResponse = {
  query: string;
  answer: string;
  confidence: number;
  intent?: {
    category?: string | null;
    filters?: string[];
    location_hint?: string | null;
  };
  best_place?: RagResult | null;
  total_results: number;
  sources: {
    database: RagResult[];
    osm: RagResult[];
    overpass: RagResult[];
  };
};


type SearchParams = {
  query: string;
  userLat: number;
  userLng: number;
};

export function useSearch() {
  return useMutation({
    mutationFn: async ({ query, userLat, userLng }: SearchParams): Promise<RagResponse> => {
      return apiRequest("/search", {
        method: "POST",
        body: JSON.stringify({
          query,
          location: { lat: userLat || 8.9806, lng: userLng || 38.7578 },
          fast_mode: true,
        }),
      });
    },
  });
}
