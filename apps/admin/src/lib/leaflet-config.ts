import L from "leaflet";

// Fix for default Leaflet icon paths in Vite
// Using unpkg CDN because relative asset paths break inside map render
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default L;
