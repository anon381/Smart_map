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
      const data = await apiRequest("/search", {
        method: "POST",
        body: JSON.stringify({
          query,
          location: { lat: userLat || 8.9806, lng: userLng || 38.7578 },
          fast_mode: true, // Note: the backend ignores fast_mode and runs unified search
        }),
      });

      // The backend returns a unified format with `smartmap` and `global`
      // We will prefer the global answer if it has results or a high confidence, otherwise fallback to smartmap.
      const hasGlobal = data.global && data.global.answer && !data.global.answer.includes('unavailable');
      const preferred = hasGlobal ? data.global : data.smartmap;
      
      const allResults = [
         ...(data.smartmap?.results || []),
         ...(data.global?.results || [])
      ];
      
      // Deduplicate by name/id
      const uniqueResults = Array.from(new Map(allResults.map((item: any) => [item.id || item.name, item])).values()) as RagResult[];

      return {
        query: data.query,
        answer: preferred?.answer || "No response generated.",
        confidence: preferred?.confidence || 0,
        total_results: uniqueResults.length,
        sources: {
          database: uniqueResults.filter(r => r.source === 'database' || !r.source),
          osm: uniqueResults.filter(r => r.source === 'osm'),
          overpass: uniqueResults.filter(r => r.source === 'overpass'),
        }
      };
    },
  });
}
