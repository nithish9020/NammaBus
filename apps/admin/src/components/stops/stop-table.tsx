import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import type { Stop } from "@/types";

interface StopTableProps {
  stops: Stop[];
  isLoading: boolean;
  onDelete: (stop: Stop) => void;
}

export function StopTable({ stops, isLoading, onDelete }: StopTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full rounded-md border bg-white p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-full animate-pulse bg-slate-100 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <Input
          type="text"
          placeholder="Search stops by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 border-slate-200"
        />
      </div>

      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        {filteredStops.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 border border-dashed m-4 rounded-xl bg-slate-50">
            <p className="text-sm font-medium">No stops found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Pincode</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStops.map((stop) => (
                <TableRow key={stop.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    {stop.name}
                  </TableCell>
                  <TableCell>{stop.city}</TableCell>
                  <TableCell>{stop.pincode}</TableCell>
                  <TableCell className="text-slate-500 font-mono text-xs">
                    {stop.lat}
                  </TableCell>
                  <TableCell className="text-slate-500 font-mono text-xs">
                    {stop.lon}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {stop.createdAt ? new Date(stop.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => onDelete(stop)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Stop"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
