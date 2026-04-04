import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Stop } from "@/types";
import "@/lib/leaflet-config";

interface StopMapViewProps {
  stops: Stop[];
  onStopClick: (stop: Stop) => void;
  isLoading: boolean;
}

export function StopMapView({ stops, onStopClick, isLoading }: StopMapViewProps) {
  if (isLoading) {
    return <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-slate-500">Loading map...</div>;
  }

  if (stops.length === 0) {
    return (
      <div className="w-full h-[600px] border border-dashed rounded-md bg-white flex items-center justify-center text-slate-500">
        No stops available to map
      </div>
    );
  }

  // Default center to Coimbatore or first stop
  const defaultCenter: [number, number] = stops[0]?.lat
    ? [parseFloat(stops[0].lat), parseFloat(stops[0].lon)]
    : [11.0168, 76.9558];

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm h-[600px] relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stops.map((stop) => {
          const lat = parseFloat(stop.lat);
          const lon = parseFloat(stop.lon);
          
          if (isNaN(lat) || isNaN(lon)) return null;

          return (
            <Marker 
              key={stop.id} 
              position={[lat, lon]}
              eventHandlers={{
                click: () => onStopClick(stop),
              }}
            >
              <Popup>
                <div className="text-sm font-medium text-slate-900">{stop.name}</div>
                <div className="text-xs text-slate-500">{stop.city}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
