import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

type NewLocation = {
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
};

export function useAddLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NewLocation) => {
      return apiRequest("/locations", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nearbyLocations"] });
    },
  });
}
