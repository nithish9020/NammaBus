import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mobilityApi } from "@nammabus/shared/api";
import { Button } from "@/components/ui/button";
import { Plus, Map as MapIcon, List } from "lucide-react";
import { StopTable } from "@/components/stops/stop-table";
import { StopMapView } from "@/components/stops/stop-map-view";
import { CreateStopModal } from "@/components/stops/create-stop-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MapInfoPanel } from "@/components/shared/map-info-panel";
import type { Stop } from "@/types";

type StopView = "table" | "map";

export default function StopsPage() {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<StopView>(
    (localStorage.getItem("admin.stopView") as StopView) || "table"
  );
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Stop | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewChange = (view: StopView) => {
    setActiveView(view);
    localStorage.setItem("admin.stopView", view);
  };

  const { data: stops = [], isLoading } = useQuery({
    queryKey: ["stops"],
    queryFn: async () => {
      const res = await mobilityApi.getAllStops();
      if (res.error) throw new Error(res.error);
      if (!res.data) return [];
      return Array.isArray(res.data) ? res.data : (res.data as unknown as { stops?: Stop[] })?.stops || [];
    },
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await mobilityApi.deleteStop(deleteTarget.id);
      if (res.error) throw new Error(res.error);
      await queryClient.invalidateQueries({ queryKey: ["stops"] });
      setDeleteTarget(null);
      if (selectedStop?.id === deleteTarget.id) {
        setSelectedStop(null);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete stop");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
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
            Map View
          </Button>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Create Stop
        </Button>
      </div>

      <div className="relative">
        {activeView === "table" ? (
          <StopTable 
            stops={stops} 
            isLoading={isLoading} 
            onDelete={(stop) => setDeleteTarget(stop)} 
          />
        ) : (
          <StopMapView 
            stops={stops} 
            isLoading={isLoading} 
            onStopClick={(stop) => setSelectedStop(stop)}
          />
        )}

        {/* Floating Side Info Panel (Only appears when a stop is selected in Map view usually, or can be generic) */}
        <MapInfoPanel
          open={selectedStop !== null}
          title={selectedStop?.name || ""}
          onClose={() => setSelectedStop(null)}
          onDelete={() => setDeleteTarget(selectedStop)}
          fields={
            selectedStop
              ? [
                  { label: "City", value: selectedStop.city },
                  { label: "Pincode", value: selectedStop.pincode },
                  { label: "Latitude", value: selectedStop.lat },
                  { label: "Longitude", value: selectedStop.lon },
                ]
              : []
          }
        />
      </div>

      <CreateStopModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Stop"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
