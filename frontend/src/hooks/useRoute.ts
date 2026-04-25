import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export type RoutePoint = { lat: number; lng: number };
export type RouteResponse = {
  status: string;
  estimatedDistanceKm: number;
  estimatedTimeMin: number;
  path: RoutePoint[];
  summary?: string;
};

export type SavedRoute = {
  id: string;
  name: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  createdAt: string;
};

export function useRoute(origin: RoutePoint | null, destination: RoutePoint | null) {
  return useQuery({
    queryKey: ["route", origin, destination],
    queryFn: async () => {
      if (!origin || !destination) return null;
      return apiRequest(
        `/navigation/route?originLat=${origin.lat}&originLng=${origin.lng}&destinationLat=${destination.lat}&destinationLng=${destination.lng}`
      ) as Promise<RouteResponse>;
    },
    enabled: !!origin && !!destination,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useSaveRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<SavedRoute, "id" | "createdAt">) =>
      apiRequest("/navigation/save", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedRoutes"] });
    },
  });
}

export function useSavedRoutes() {
  return useQuery({
    queryKey: ["savedRoutes"],
    queryFn: () => apiRequest("/navigation/saved") as Promise<SavedRoute[]>,
  });
}
