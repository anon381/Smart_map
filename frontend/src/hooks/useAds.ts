import { useQuery } from "@tanstack/react-query";
import { adsApi } from "@/lib/api";

export function useAds(placement?: string) {
  return useQuery({
    queryKey: ["ads", placement],
    queryFn: async () => {
      return adsApi.listAds(placement);
    },
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}
