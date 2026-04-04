import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import type { Trip } from "@/types";

interface TripTileViewProps {
  trips: Trip[];
  isLoading: boolean;
}

export function TripTileView({ trips, isLoading }: TripTileViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 border border-dashed rounded-xl bg-white">
        <p className="text-sm font-medium">No trips to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <div key={trip.id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-900 text-lg">
                {trip.bus?.registrationNumber || "No Bus"}
              </div>
              <div className="text-sm text-slate-500">
                Route: {trip.route?.name || "Unknown"}
              </div>
            </div>
            <StatusBadge status={trip.status} />
          </div>
          
          <div className="flex flex-col gap-1 mt-auto">
            <div className="text-sm text-slate-700">
              <span className="font-medium">Driver:</span> {trip.driver?.user?.name || "Unassigned"}
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-medium">Conductor:</span> {trip.conductor?.user?.name || "Unassigned"}
            </div>
            {trip.startedAt && (
              <div className="text-xs text-slate-400 mt-2">
                Started: {formatDate(trip.startedAt)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
