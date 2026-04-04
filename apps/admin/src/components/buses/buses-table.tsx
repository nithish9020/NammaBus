import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2 } from "lucide-react";
import type { Bus } from "@/types";

interface BusesTableProps {
  buses: Bus[];
  isLoading: boolean;
  onDelete: (bus: Bus) => void;
}

export function BusesTable({ buses, isLoading, onDelete }: BusesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBuses = buses.filter((bus) => {
    const term = searchTerm.toLowerCase();
    const regMatch = bus.registrationNumber.toLowerCase().includes(term);
    const cityMatch = bus.city.toLowerCase().includes(term);
    return regMatch || cityMatch;
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading buses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search registration or city..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No buses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBuses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell className="font-medium uppercase">{bus.registrationNumber}</TableCell>
                  <TableCell className="capitalize">{bus.type || "Standard"}</TableCell>
                  <TableCell>{bus.capacity} seats</TableCell>
                  <TableCell>{bus.city}</TableCell>
                  <TableCell>
                    <Badge variant={bus.status === "active" ? "default" : "secondary"}>
                      {bus.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(bus)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
