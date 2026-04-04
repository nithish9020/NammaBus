import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Route } from "@/types";


import "@/lib/leaflet-config";

interface RouteMapViewProps {
  routes: Route[];
  isLoading: boolean;
}

export function RouteMapView({ routes, isLoading }: RouteMapViewProps) {
  if (isLoading) {
    return <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-slate-500">Loading map...</div>;
  }

  if (routes.length === 0) {
    return (
      <div className="w-full h-[600px] border border-dashed rounded-md bg-white flex items-center justify-center text-slate-500">
        No routes available to map
      </div>
    );
  }

  // Default center to Bangalore if no routes, or first route's first stop
  const defaultCenter: [number, number] = routes[0]?.stops?.[0]?.stop 
    ? [parseFloat(routes[0].stops[0].stop.lat), parseFloat(routes[0].stops[0].stop.lon)]
    : [12.9716, 77.5946];

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm h-[600px] relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => {
          if (!route.stops || route.stops.length < 2) return null;
          
          // Sort stops by sequence just in case
          const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);
          
          const positions: [number, number][] = sortedStops
            .filter(rs => rs.stop)
            .map(rs => [parseFloat(rs.stop!.lat), parseFloat(rs.stop!.lon)]);

          if (positions.length < 2) return null;

          return (
            <div key={route.id}>
              <Polyline 
                positions={positions} 
                pathOptions={{ 
                  color: route.color || "#3b82f6", 
                  weight: 5,
                  opacity: 0.8 
                }} 
              />
              
              {/* Optional: Add markers for first and last stops to highlight the route span */}
              {sortedStops[0]?.stop && (
                <Marker position={[parseFloat(sortedStops[0].stop.lat), parseFloat(sortedStops[0].stop.lon)]}>
                  <Popup>
                    <div className="text-sm font-medium">{route.routeNumber} - Origin</div>
                    <div className="text-xs text-slate-500">{sortedStops[0].stop.name}</div>
                  </Popup>
                </Marker>
              )}
              {sortedStops[sortedStops.length - 1]?.stop && sortedStops.length > 1 && (
                <Marker position={[parseFloat(sortedStops[sortedStops.length - 1]!.stop!.lat), parseFloat(sortedStops[sortedStops.length - 1]!.stop!.lon)]}>
                  <Popup>
                    <div className="text-sm font-medium">{route.routeNumber} - Destination</div>
                    <div className="text-xs text-slate-500">{sortedStops[sortedStops.length - 1]!.stop!.name}</div>
                  </Popup>
                </Marker>
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
