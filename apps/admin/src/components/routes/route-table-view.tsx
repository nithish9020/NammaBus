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
import type { Route } from "@/types";
import { mobilityApi } from "@nammabus/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

interface RouteTableViewProps {
  routes: Route[];
  isLoading: boolean;
}

export function RouteTableView({ routes, isLoading }: RouteTableViewProps) {
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      const res = await mobilityApi.deleteRoute(id);
      if (res.error) throw new Error(res.error);
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    } catch (e: any) {
      alert(e.message || "Failed to delete route");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-md border bg-white p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-full animate-pulse bg-slate-100 rounded" />
        ))}
      </div>
    );
  }

  if (!routes || routes.length === 0) {
    return (
      <div className="w-full h-64 border border-dashed rounded-md bg-white flex items-center justify-center text-slate-500">
        No routes configured
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Stops</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <TableCell className="font-bold text-slate-900">
                {route.routeNumber}
              </TableCell>
              <TableCell>{route.name}</TableCell>
              <TableCell>{route.origin}</TableCell>
              <TableCell>{route.destination}</TableCell>
              <TableCell>{route.city}</TableCell>
              <TableCell>{route.stops?.length || 0}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-slate-100 outline-none">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={() => handleDelete(route.id)}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      Delete Route
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
