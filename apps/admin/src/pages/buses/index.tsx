import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mobilityApi } from "@nammabus/shared/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BusesTable } from "@/components/buses/buses-table";
import { CreateBusModal } from "@/components/buses/create-bus-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Bus } from "@/types";

export default function BusesPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Bus | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: buses = [], isLoading } = useQuery({
    queryKey: ["buses"],
    queryFn: async () => {
      const res = await mobilityApi.getAllBuses();
      if (res.error) throw new Error(res.error);
      if (!res.data) return [];
      return Array.isArray(res.data) ? res.data : (res.data as unknown as { buses?: Bus[] })?.buses || [];
    },
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await mobilityApi.deleteBus(deleteTarget.id);
      if (res.error) throw new Error(res.error);
      await queryClient.invalidateQueries({ queryKey: ["buses"] });
      setDeleteTarget(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete bus");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Buses</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Bus
        </Button>
      </div>

      <div className="bg-white rounded-lg">
        <BusesTable 
          buses={buses} 
          isLoading={isLoading} 
          onDelete={(bus) => setDeleteTarget(bus)} 
        />
      </div>

      <CreateBusModal 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Bus"
        description={`Are you sure you want to delete bus ${deleteTarget?.registrationNumber}? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
