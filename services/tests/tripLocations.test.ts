import { request, assert, userId } from "./helpers";

export async function testTripLocations() {
  console.log("\n📍 Trip Locations (GPS)");

  // ── Setup: bus + route + stops + driver + trip ──
  const busRes = await request("POST", "/api/mobility/buses", {
    registrationNumber: `TN-LOC-${Date.now()}`,
    capacity: 35,
    city: "Coimbatore",
  });
  const locBusId = busRes.data?.bus?.id;

  const s1 = await request("POST", "/api/mobility/stops", {
    name: "Loc Stop A", lat: "11.0001", lon: "76.9500", city: "Coimbatore", pincode: "641001",
  });
  const s2 = await request("POST", "/api/mobility/stops", {
    name: "Loc Stop B", lat: "11.0050", lon: "76.9700", city: "Coimbatore", pincode: "641001",
  });
  const locStopA = s1.data?.id;
  const locStopB = s2.data?.id;

  const routeRes = await request("POST", "/api/mobility/routes", {
    routeNumber: `LR-${Date.now()}`,
    name: "Loc Route",
    origin: "Loc Stop A",
    destination: "Loc Stop B",
    city: "Coimbatore",
    stops: [
      { stopId: locStopA, sequence: 1 },
      { stopId: locStopB, sequence: 2 },
    ],
  });
  const locRouteId = routeRes.data?.route?.id;

  const driverRes = await request("POST", "/api/identity/drivers", {
    userId,
    licenseNumber: `LOC-DL-${Date.now()}`,
    phone: "8888800000",
    city: "Coimbatore",
  });
  const locDriverId = driverRes.data?.driver?.id;

  const tripRes = await request("POST", "/api/mobility/trips", {
    busId: locBusId,
    routeId: locRouteId,
    driverId: locDriverId,
  });
  const locTripId = tripRes.data?.trip?.id;

  // ── Bulk insert GPS pings ──
  const addLocs = await request("POST", `/api/mobility/trips/${locTripId}/locations`, {
    locations: [
      { lat: "11.0001", lon: "76.9500", speed: "25.50", heading: "90.00" },
      { lat: "11.0010", lon: "76.9550", speed: "30.00", heading: "85.00" },
      { lat: "11.0025", lon: "76.9600", speed: "28.00", heading: "88.00" },
    ],
  });
  assert("Bulk insert locations", addLocs.status === 201, `status=${addLocs.status} ${JSON.stringify(addLocs.data)}`);
  assert("3 locations inserted", addLocs.data?.locations?.length === 3);

  // ── Get all locations for trip ──
  const getLocs = await request("GET", `/api/mobility/trips/${locTripId}/locations`);
  assert("Get trip locations", getLocs.status === 200 && getLocs.data?.locations?.length === 3);

  // ── Get latest location ──
  const latest = await request("GET", `/api/mobility/trips/${locTripId}/locations/latest`);
  assert("Get latest location", latest.status === 200 && !!latest.data?.location?.lat);

  // ── Cleanup (trip delete cascades locations) ──
  await request("DELETE", `/api/mobility/trips/${locTripId}`);
  await request("DELETE", `/api/identity/drivers/${locDriverId}`);
  await request("DELETE", `/api/mobility/routes/${locRouteId}`);
  await request("DELETE", `/api/mobility/stops/${locStopA}`);
  await request("DELETE", `/api/mobility/stops/${locStopB}`);
  await request("DELETE", `/api/mobility/buses/${locBusId}`);
}
