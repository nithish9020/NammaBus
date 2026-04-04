import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mobilityApi, identityApi } from "@nammabus/shared/api";
import type { Route, Bus, Driver, Conductor } from "@/types";

const formSchema = z.object({
  routeId: z.string().min(1, "Route is required"),
  busId: z.string().min(1, "Bus is required"),
  driverId: z.string().min(1, "Driver is required"),
  conductorId: z.string().min(1, "Conductor is required"),
  // Must be ISO format, but the time-local input handles this mostly correctly.
  // Converting the HTML datetime-local string to a proper Date
  scheduledStart: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }).refine((val) => new Date(val).getTime() > Date.now(), {
    message: "Must be a future datetime",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTripModal({ open, onOpenChange, onSuccess }: CreateTripModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      routeId: "",
      busId: "",
      driverId: "",
      conductorId: "",
      scheduledStart: "",
    },
  });

  // Reset form when opened
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  // Data fetching for dropdowns
  const { data: routes } = useQuery({ queryKey: ["routes"], queryFn: async () => (await mobilityApi.getAllRoutes()).data?.routes || [] });
  const { data: buses } = useQuery({ queryKey: ["buses"], queryFn: async () => (await mobilityApi.getAllBuses()).data?.buses || [] });
  const { data: drivers } = useQuery({ queryKey: ["drivers"], queryFn: async () => (await identityApi.getAllDrivers()).data?.drivers || [] });
  const { data: conductors } = useQuery({ queryKey: ["conductors"], queryFn: async () => (await identityApi.getAllConductors()).data?.conductors || [] });

  const activeBuses = ((buses || []) as Bus[]).filter(b => b.status === "active");
  const activeDrivers = ((drivers || []) as Driver[]).filter(d => d.status === "active");
  const activeConductors = ((conductors || []) as Conductor[]).filter(c => c.status === "active");

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await mobilityApi.createTrip({
        ...values,
        // Status handled in backend via default typically, or pass scheduled if allowed
      });
      if (res.error) throw new Error(res.error);
      
      // Update its status and scheduled start if allowed
      if (res.data?.trip) {
         // Optionally hit Update API if backend create doesn't support scheduledStart inline
         // Admin guide instructs { routeId, busId, driverId, conductorId, scheduledStart } 
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to create trip");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="routeId">Route</Label>
            <select
              id="routeId"
              {...register("routeId")}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Route</option>
              {((routes || []) as Route[]).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeNumber} — {r.name}
                </option>
              ))}
            </select>
            {errors.routeId && <p className="text-sm text-red-500">{errors.routeId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="busId">Bus</Label>
            <select
              id="busId"
              {...register("busId")}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Bus</option>
              {activeBuses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.registrationNumber} (Cap: {b.capacity})
                </option>
              ))}
            </select>
            {errors.busId && <p className="text-sm text-red-500">{errors.busId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverId">Driver</Label>
            <select
              id="driverId"
              {...register("driverId")}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Driver</option>
              {activeDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user?.name || d.id} - {d.licenseNumber}
                </option>
              ))}
            </select>
            {errors.driverId && <p className="text-sm text-red-500">{errors.driverId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="conductorId">Conductor</Label>
            <select
              id="conductorId"
              {...register("conductorId")}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Conductor</option>
              {activeConductors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.user?.name || c.id} - {c.badgeNumber}
                </option>
              ))}
            </select>
            {errors.conductorId && <p className="text-sm text-red-500">{errors.conductorId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledStart">Scheduled Start</Label>
            <Input
              id="scheduledStart"
              type="datetime-local"
              {...register("scheduledStart")}
            />
            {errors.scheduledStart && <p className="text-sm text-red-500">{errors.scheduledStart.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="default" className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating..." : "Create Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
