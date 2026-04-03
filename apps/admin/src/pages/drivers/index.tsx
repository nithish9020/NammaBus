import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { identityApi } from "@nammabus/shared/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriversTable } from "@/components/drivers/drivers-table";
import { ConductorsTable } from "@/components/conductors/conductors-table";
import { CreateDriverModal } from "@/components/drivers/create-driver-modal";
import { CreateConductorModal } from "@/components/conductors/create-conductor-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Driver, Conductor } from "@/types";

export default function DriversConductorsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("drivers");
  const [isCreateDriverOpen, setIsCreateDriverOpen] = useState(false);
  const [isCreateConductorOpen, setIsCreateConductorOpen] = useState(false);
  
  const [deleteDriverTarget, setDeleteDriverTarget] = useState<Driver | null>(null);
  const [deleteConductorTarget, setDeleteConductorTarget] = useState<Conductor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: drivers = [], isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const res = await identityApi.getAllDrivers();
      if (res.error) throw new Error(res.error);
      if (!res.data) return [];
      return Array.isArray(res.data) ? res.data : (res.data as unknown as { drivers?: Driver[] })?.drivers || [];
    },
  });

  const { data: conductors = [], isLoading: isLoadingConductors } = useQuery({
    queryKey: ["conductors"],
    queryFn: async () => {
      const res = await identityApi.getAllConductors();
      if (res.error) throw new Error(res.error);
      if (!res.data) return [];
      return Array.isArray(res.data) ? res.data : (res.data as unknown as { conductors?: Conductor[] })?.conductors || [];
    },
  });

  const handleDeleteDriver = async () => {
    if (!deleteDriverTarget) return;
    setIsDeleting(true);
    try {
      const res = await identityApi.deleteDriver(deleteDriverTarget.id);
      if (res.error) throw new Error(res.error);
      await queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setDeleteDriverTarget(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete driver");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteConductor = async () => {
    if (!deleteConductorTarget) return;
    setIsDeleting(true);
    try {
      const res = await identityApi.deleteConductor(deleteConductorTarget.id);
      if (res.error) throw new Error(res.error);
      await queryClient.invalidateQueries({ queryKey: ["conductors"] });
      setDeleteConductorTarget(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete conductor");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Personnel</h1>
        {activeTab === "drivers" ? (
          <Button onClick={() => setIsCreateDriverOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Driver
          </Button>
        ) : (
          <Button onClick={() => setIsCreateConductorOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Conductor
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100/50 mb-4 inline-flex h-10 items-center justify-center rounded-md p-1 text-slate-500">
          <TabsTrigger value="drivers" className="px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">
            Drivers
          </TabsTrigger>
          <TabsTrigger value="conductors" className="px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">
            Conductors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="drivers" className="mt-0 border-none p-0 outline-none">
          <DriversTable 
            drivers={drivers} 
            isLoading={isLoadingDrivers} 
            onDelete={(driver) => setDeleteDriverTarget(driver)} 
          />
        </TabsContent>
        
        <TabsContent value="conductors" className="mt-0 border-none p-0 outline-none">
          <ConductorsTable 
            conductors={conductors} 
            isLoading={isLoadingConductors} 
            onDelete={(conductor) => setDeleteConductorTarget(conductor)} 
          />
        </TabsContent>
      </Tabs>

      <CreateDriverModal
        open={isCreateDriverOpen}
        onOpenChange={setIsCreateDriverOpen}
      />
      
      <CreateConductorModal
        open={isCreateConductorOpen}
        onOpenChange={setIsCreateConductorOpen}
      />

      <ConfirmDialog
        open={deleteDriverTarget !== null}
        onOpenChange={(open) => !open && setDeleteDriverTarget(null)}
        title="Delete Driver"
        description={`Are you sure you want to delete ${deleteDriverTarget?.user?.name || deleteDriverTarget?.licenseNumber}? This action cannot be undone.`}
        onConfirm={handleDeleteDriver}
        isLoading={isDeleting}
      />

      <ConfirmDialog
        open={deleteConductorTarget !== null}
        onOpenChange={(open) => !open && setDeleteConductorTarget(null)}
        title="Delete Conductor"
        description={`Are you sure you want to delete ${deleteConductorTarget?.user?.name || deleteConductorTarget?.badgeNumber}? This action cannot be undone.`}
        onConfirm={handleDeleteConductor}
        isLoading={isDeleting}
      />
    </div>
  );
}
