import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { mobilityApi } from "@nammabus/shared/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),
  lat: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90, {
    message: "Latitude must be a valid number between -90 and 90",
  }),
  lon: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180, {
    message: "Longitude must be a valid number between -180 and 180",
  }),
});

type FormValues = z.infer<typeof schema>;

interface CreateStopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStopModal({ open, onOpenChange }: CreateStopModalProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", city: "", pincode: "", lat: "", lon: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await mobilityApi.createStop(data);
      if (res.error) throw new Error(res.error);
      queryClient.invalidateQueries({ queryKey: ["stops"] });
      reset();
      onOpenChange(false);
    } catch (e: any) {
      alert(e.message || "Failed to create stop");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Stop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g. Silk Board" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} placeholder="e.g. Bengaluru" />
            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" {...register("pincode")} placeholder="e.g. 560068" />
            {errors.pincode && <p className="text-sm text-red-500">{errors.pincode.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" {...register("lat")} placeholder="12.9716" />
              {errors.lat && <p className="text-sm text-red-500">{errors.lat.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lon">Longitude</Label>
              <Input id="lon" {...register("lon")} placeholder="77.5946" />
              {errors.lon && <p className="text-sm text-red-500">{errors.lon.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating..." : "Create Stop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
