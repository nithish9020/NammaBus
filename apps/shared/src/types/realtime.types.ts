export interface RealtimeRoom {
  tripId: string;
  watchers: number;
}

export interface RealtimeStats {
  totalRooms: number;
  totalWatchers: number;
  rooms: RealtimeRoom[];
}
