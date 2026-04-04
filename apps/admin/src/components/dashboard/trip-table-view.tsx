import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import type { Trip, TripStatus } from "@/types";
import { mobilityApi } from "@nammabus/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

interface TripTableViewProps {
  trips: Trip[];
  isLoading: boolean;
}

export function TripTableView({ trips, isLoading }: TripTableViewProps) {
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (id: string, status: TripStatus) => {
    try {
      const res = await mobilityApi.updateTrip(id, { status });
      if (res.error) throw new Error(res.error);
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    } catch (e: any) {
      alert(e.message || "Failed to update trip status");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-md border bg-white">
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-full animate-pulse bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="w-full h-64 border border-dashed rounded-md bg-white flex items-center justify-center text-slate-500">
        No trips available
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Route Number</TableHead>
            <TableHead>Route Name</TableHead>
            <TableHead>Bus Registration</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Conductor</TableHead>
            <TableHead>Started At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id} className="hover:bg-blue-50/50">
              <TableCell className="font-medium text-slate-900">
                {trip.route?.routeNumber || "N/A"}
              </TableCell>
              <TableCell>{trip.route?.name || "N/A"}</TableCell>
              <TableCell className="font-bold text-slate-800">
                {trip.bus?.registrationNumber || "N/A"}
              </TableCell>
              <TableCell>{trip.driver?.user?.name || "Unassigned"}</TableCell>
              <TableCell>{trip.conductor?.user?.name || "Unassigned"}</TableCell>
              <TableCell className="text-slate-500">
                {trip.startedAt ? formatDate(trip.startedAt) : "-"}
              </TableCell>
              <TableCell>
                <StatusBadge status={trip.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-slate-100 outline-none">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, "in_progress")}>
                      Mark In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, "completed")}>
                      Mark Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, "cancelled")} className="text-red-600 focus:text-red-700">
                      Cancel Trip
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
