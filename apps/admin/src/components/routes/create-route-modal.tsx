import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { mobilityApi } from "@nammabus/shared/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Stop } from "@/types";

const schema = z.object({
  routeNumber: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  color: z.string().min(1, "Required"),
  stops: z.array(
    z.object({
      stopId: z.string(),
      sequence: z.number(),
    })
  ).min(2, "At least two stops required"),
});

type FormValues = z.infer<typeof schema>;

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRouteModal({ open, onOpenChange }: CreateRouteModalProps) {
  const queryClient = useQueryClient();

  const { data: stops = [] } = useQuery({
    queryKey: ["stops"],
    queryFn: async () => {
      const res = await mobilityApi.getAllStops();
      return res.data || [];
    },
    enabled: open,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stops: [] },
  });

  const currentStops = watch("stops");

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await mobilityApi.createRoute(data);
      if (res.error) throw new Error(res.error);
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      reset();
      onOpenChange(false);
    } catch (e: any) {
      alert(e.message || "Failed to create route");
    }
  };

  const handleAddStop = (stopId: string) => {
    if (!stopId) return;
    const isAlreadyAdded = currentStops.some((s) => s.stopId === stopId);
    if (!isAlreadyAdded) {
      setValue("stops", [
        ...currentStops,
        { stopId, sequence: currentStops.length + 1 },
      ]);
    }
  };

  const handleRemoveStop = (index: number) => {
    const updated = currentStops.filter((_, i) => i !== index).map((s, i) => ({ ...s, sequence: i + 1 }));
    setValue("stops", updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Route</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Route Number</label>
              <input
                {...register("routeNumber")}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. 500D"
              />
              {errors.routeNumber && <p className="text-sm text-red-500">{errors.routeNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                {...register("name")}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. Silk Board to Tin Factory"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Origin</label>
              <input {...register("origin")} className="w-full p-2 border rounded-md" />
              {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <input {...register("destination")} className="w-full p-2 border rounded-md" />
              {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input {...register("city")} className="w-full p-2 border rounded-md" />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color (Hex)</label>
              <input {...register("color")} type="color" className="w-full h-10 p-1 border rounded-md" />
              {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-medium mb-2">Route Stops (In Order)</h4>
            
            <div className="flex gap-2 mb-4">
              <Select onValueChange={(val: any) => val && handleAddStop(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Add stop to route..." />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((stop: Stop) => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {errors.stops && <p className="text-sm text-red-500 mb-2">{errors.stops.message}</p>}
            
            <ul className="space-y-2">
              {currentStops.map((s, index) => {
                const stopDetails = stops.find((st: Stop) => st.id === s.stopId);
                return (
                  <li key={s.stopId} className="flex items-center justify-between p-2 bg-slate-50 border rounded-md">
                    <span className="text-sm font-medium text-slate-700">
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-xs text-white bg-slate-400 rounded-full">
                        {index + 1}
                      </span>
                      {stopDetails?.name || s.stopId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(index)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
             {currentStops.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500 border border-dashed rounded-md bg-slate-50">
                  Select stops from the dropdown to build the route path.
                </div>
              )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating..." : "Create Route"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
