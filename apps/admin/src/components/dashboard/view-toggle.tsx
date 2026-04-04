import { Map, LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardView = "map" | "tile" | "table";

interface ViewToggleProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  const views = [
    { id: "map" as const, icon: Map, label: "Map view" },
    { id: "tile" as const, icon: LayoutGrid, label: "Tile view" },
    { id: "table" as const, icon: Table2, label: "Table view" },
  ];

  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1 shadow-sm">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          aria-label={view.label}
          title={view.label}
          className={cn(
            "p-2 rounded transition-colors",
            activeView === view.id
              ? "bg-blue-600 text-white shadow"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <view.icon className="h-4 w-4" strokeWidth={2.5} />
        </button>
      ))}
    </div>
  );
}
