import { useQuery } from "@tanstack/react-query";
import { realtimeApi } from "@nammabus/shared/api";
import type { RealtimeStats } from "@nammabus/shared/types";

export function useRealtimeStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["realtime-stats"],
    queryFn: async () => {
      const res = await realtimeApi.getRealtimeStats();
      if (!res.data || res.error) {
        throw new Error(res.error || "Failed to fetch realtime stats");
      }
      return res.data as RealtimeStats;
    },
    refetchInterval: 10_000,
  });

  return { stats: data, isLoading, isError };
}
