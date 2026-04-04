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
import type { Driver } from "@/types";

interface DriversTableProps {
  drivers: Driver[];
  isLoading: boolean;
  onDelete: (driver: Driver) => void;
}

export function DriversTable({ drivers, isLoading, onDelete }: DriversTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrivers = drivers.filter((driver) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = driver.user?.name?.toLowerCase().includes(term);
    const licenseMatch = driver.licenseNumber.toLowerCase().includes(term);
    const cityMatch = driver.city.toLowerCase().includes(term);
    return nameMatch || licenseMatch || cityMatch;
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading drivers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search name, license or city..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>License Number</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.user?.name || "Unknown"}</TableCell>
                  <TableCell>{driver.user?.email || "N/A"}</TableCell>
                  <TableCell className="uppercase">{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.city}</TableCell>
                  <TableCell>
                    <Badge variant={driver.status === "active" ? "default" : "secondary"}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(driver)}
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
