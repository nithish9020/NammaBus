import type { RealtimeStats } from "@nammabus/shared/types";

interface StatsBarProps {
  stats: RealtimeStats | undefined;
  isLoading: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps) {
  return (
    <div className="w-full bg-blue-50 border-b border-blue-600 rounded-t-xl px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-medium">Active Trips:</span>
            {isLoading ? (
              <div className="h-6 w-12 bg-blue-200 animate-pulse rounded" />
            ) : (
              <span className="font-bold text-blue-900 text-xl">{stats?.totalRooms ?? 0}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-medium">Passengers Watching:</span>
            {isLoading ? (
              <div className="h-6 w-12 bg-blue-200 animate-pulse rounded" />
            ) : (
              <span className="font-bold text-blue-900 text-xl">{stats?.totalWatchers ?? 0}</span>
            )}
          </div>
        </div>
        <div className="text-sm font-medium text-slate-500">Updates every 10 seconds</div>
      </div>
    </div>
  );
}
