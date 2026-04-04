import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapInfoPanelProps {
  open: boolean;
  title: string;
  fields: Array<{ label: string; value: string }>;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function MapInfoPanel({
  open,
  title,
  fields,
  onEdit,
  onDelete,
  onClose,
}: MapInfoPanelProps) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white border-l shadow-lg z-[1000] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-slate-900 truncate">{title}</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {field.label}
            </span>
            <span className="text-sm text-slate-900">{field.value}</span>
          </div>
        ))}
      </div>

      {(onEdit || onDelete) && (
        <div className="p-4 border-t flex flex-col gap-2 bg-slate-50 mt-auto shrink-0">
          {onEdit && (
            <Button variant="outline" className="w-full" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" className="w-full" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
