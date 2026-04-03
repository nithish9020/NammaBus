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
import type { Conductor } from "@/types";

interface ConductorsTableProps {
  conductors: Conductor[];
  isLoading: boolean;
  onDelete: (conductor: Conductor) => void;
}

export function ConductorsTable({ conductors, isLoading, onDelete }: ConductorsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConductors = conductors.filter((conductor) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = conductor.user?.name?.toLowerCase().includes(term);
    const badgeMatch = conductor.badgeNumber.toLowerCase().includes(term);
    const cityMatch = conductor.city.toLowerCase().includes(term);
    return nameMatch || badgeMatch || cityMatch;
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading conductors...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search name, badge or city..."
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
              <TableHead>Badge Number</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConductors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No conductors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredConductors.map((conductor) => (
                <TableRow key={conductor.id}>
                  <TableCell className="font-medium">{conductor.user?.name || "Unknown"}</TableCell>
                  <TableCell>{conductor.user?.email || "N/A"}</TableCell>
                  <TableCell className="uppercase">{conductor.badgeNumber}</TableCell>
                  <TableCell>{conductor.phone}</TableCell>
                  <TableCell>{conductor.city}</TableCell>
                  <TableCell>
                    <Badge variant={conductor.status === "active" ? "default" : "secondary"}>
                      {conductor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(conductor)}
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
