import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mobilityApi } from "@nammabus/shared/api";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { ViewToggle } from "@/components/dashboard/view-toggle";
import type { DashboardView } from "@/components/dashboard/view-toggle";
import { TripTileView } from "@/components/dashboard/trip-tile-view";
import { TripTableView } from "@/components/dashboard/trip-table-view";
import { TripMapView } from "@/components/dashboard/trip-map-view";
import { CreateTripModal } from "@/components/dashboard/create-trip-modal";
import { useRealtimeStats } from "@/hooks/use-realtime-stats";
import type { Trip } from "@/types";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<DashboardView>(() => {
    return (localStorage.getItem("admin-dashboard-view") as DashboardView) || "tile";
  });
  
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { stats, isLoading: isStatsLoading } = useRealtimeStats();

  const { data: tripsRes, isLoading: isTripsLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await mobilityApi.getAllTrips();
      if (!res.data || res.error) throw new Error(res.error || "Failed to load trips");
      return res.data;
    },
    refetchInterval: 15_000,
  });

  const trips = (tripsRes?.trips as unknown as Trip[]) || [];

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    localStorage.setItem("admin-dashboard-view", view);
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["trips"] });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <StatsBar stats={stats} isLoading={isStatsLoading} />

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
        <div>
          <button 
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 font-medium rounded hover:bg-blue-700 transition"
          >
            Start New Trip
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeView === "map" && (
          <TripMapView trips={trips} />
        )}
        {activeView === "tile" && (
          <TripTileView trips={trips} isLoading={isTripsLoading} />
        )}
        {activeView === "table" && (
          <TripTableView trips={trips} isLoading={isTripsLoading} />
        )}
      </div>

      <CreateTripModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
        onSuccess={handleCreateSuccess} 
      />
    </div>
  );
}
