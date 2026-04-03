import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

function formatStatus(status: string): string {
  if (!status) return "";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normStatus = status.toLowerCase();

  const isGreen = normStatus === "active" || normStatus === "in_progress";
  const isBlue = normStatus === "scheduled";
  const isGray = normStatus === "completed";
  const isYellow = normStatus === "inactive" || normStatus === "maintenance";
  const isRed =
    normStatus === "suspended" ||
    normStatus === "cancelled" ||
    normStatus === "retired";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        isGreen && "bg-green-100 text-green-800 border-green-200",
        isBlue && "bg-blue-100 text-blue-800 border-blue-200",
        isGray && "bg-gray-100 text-gray-800 border-gray-200",
        isYellow && "bg-yellow-100 text-yellow-800 border-yellow-200",
        isRed && "bg-red-100 text-red-800 border-red-200"
      )}
    >
      {formatStatus(status)}
    </Badge>
  );
}
