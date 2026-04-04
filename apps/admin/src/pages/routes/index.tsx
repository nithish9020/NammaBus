import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mobilityApi } from "@nammabus/shared/api";
import { Button } from "@/components/ui/button";
import { Plus, Map as MapIcon, List } from "lucide-react";
import { RouteTableView } from "@/components/routes/route-table-view";
import { RouteMapView } from "@/components/routes/route-map-view";
import { CreateRouteModal } from "@/components/routes/create-route-modal";
import type { Route, Stop } from "@/types";

export type RouteView = "table" | "map";

export default function RoutesPage() {
  const [activeView, setActiveView] = useState<RouteView>(
    (localStorage.getItem("admin.routeView") as RouteView) || "table"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleViewChange = (view: RouteView) => {
    setActiveView(view);
    localStorage.setItem("admin.routeView", view);
  };

  const { data: rawRoutes = [], isLoading: isRoutesLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const res = await mobilityApi.getAllRoutes();
      if (res.error) throw new Error(res.error);
      return Array.isArray(res.data) ? res.data : (res.data as any)?.routes || [];
    },
  });

  const { data: rawStops = [], isLoading: isStopsLoading } = useQuery({
    queryKey: ["stops"],
    queryFn: async () => {
      const res = await mobilityApi.getAllStops();
      if (res.error) throw new Error(res.error);
      return Array.isArray(res.data) ? res.data : (res.data as any)?.stops || [];
    },
  });

  const isLoading = isRoutesLoading || isStopsLoading;

  // Optimistically stitch routes with full stop objects in the frontend
  const routes = useMemo(() => {
    if (!rawRoutes.length || !rawStops.length) return rawRoutes as Route[];

    const stopsMap = new Map<string, Stop>();
    (rawStops as Stop[]).forEach((stop) => stopsMap.set(stop.id, stop));

    return (rawRoutes as Route[]).map((route) => {
      if (!route.stops) return route;
      const populatedStops = route.stops.map((rs: any) => ({
        ...rs,
        stop: stopsMap.get(rs.stopId),
      }));
      return { ...route, stops: populatedStops };
    });
  }, [rawRoutes, rawStops]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
          <Button
            variant={activeView === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("table")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={activeView === "map" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("map")}
            className="flex items-center gap-2"
          >
            <MapIcon className="h-4 w-4" />
            Map Map
          </Button>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Create Route
        </Button>
      </div>

      {activeView === "table" ? (
        <RouteTableView routes={routes} isLoading={isLoading} />
      ) : (
        <RouteMapView routes={routes} isLoading={isLoading} />
      )}

      <CreateRouteModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
