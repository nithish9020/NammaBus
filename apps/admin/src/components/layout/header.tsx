import { useRealtimeStats } from "@/hooks/use-realtime-stats";

export function Header() {
  const { stats, isLoading } = useRealtimeStats();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-x-2 text-lg font-medium leading-none tracking-tight text-slate-900">
          <span>Active Trips:</span>
          {isLoading ? (
            <div className="h-5 w-8 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="font-bold text-blue-600">{stats?.totalRooms ?? 0}</span>
          )}
        </div>
        <div className="flex items-center gap-x-2 text-sm font-medium text-slate-500">
          <span>Passengers Watching:</span>
          {isLoading ? (
            <div className="h-4 w-6 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="font-bold text-blue-600">{stats?.totalWatchers ?? 0}</span>
          )}
        </div>
      </div>
    </header>
  );
}
