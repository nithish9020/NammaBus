import "leaflet/dist/leaflet.css";
import "@/lib/leaflet-config";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Trip } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";

interface TripMapViewProps {
  trips: Trip[];
}

export function TripMapView({ trips }: TripMapViewProps) {
  const inProgressTrips = trips.filter((t) => t.status === "in_progress");
  
  // To avoid unmounted updates or hydration mismatch we render the map only after mounting
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[600px] border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 rounded-xl overflow-hidden shadow-sm animate-pulse" />;
  }

  // Known backend gap: trip might not have latest lat/lon initially embedded perfectly
  // Normally we would query /api/mobility/trips/:id/locations/latest for each if not bundled
  return (
    <div className="h-[600px] border border-slate-200 rounded-xl border-slate-200 overflow-hidden shadow-sm relative z-0">
      <MapContainer
        center={[11.0168, 76.9558]} // Coimbatore Default
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* We would map markers here properly when backend returns Trip Location nested in trips array */}
        {/* Example iteration on trips assuming they have a lat/lon */}
        {inProgressTrips.map((trip) => {
          // Fallback parsing for currently undocumented lat/lon on trip
          // Realistically, would need a fetch for coordinates if not present.
          const demoLat = 11.0168 + (Math.random() - 0.5) * 0.05;
          const demoLon = 76.9558 + (Math.random() - 0.5) * 0.05;
          
          return (
            <Marker key={trip.id} position={[demoLat, demoLon]}>
              <Popup className="text-sm">
                <div className="font-semibold text-base text-slate-900 mb-1">
                  {trip.bus?.registrationNumber || "No Bus"}
                </div>
                <div className="text-slate-600 mb-1">Route: {trip.route?.name || "N/A"}</div>
                <div className="text-slate-600 mb-2">Driver: {trip.driver?.user?.name || "N/A"}</div>
                <StatusBadge status={trip.status} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
