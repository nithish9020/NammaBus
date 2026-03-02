import { request, assert, userId } from "./helpers";

export async function testTrips() {
  console.log("\n🚐 Trips CRUD");

  // ── Setup: create bus, route (with stops), and driver ──
  const busRes = await request("POST", "/api/mobility/buses", {
    registrationNumber: `TN-TRIP-${Date.now()}`,
    capacity: 40,
    city: "Coimbatore",
  });
  const testBusId = busRes.data?.bus?.id;

  const s1 = await request("POST", "/api/mobility/stops", {
    name: "Trip Stop A", lat: "11.0001", lon: "76.9500", city: "Coimbatore", pincode: "641001",
  });
  const s2 = await request("POST", "/api/mobility/stops", {
    name: "Trip Stop B", lat: "11.0012", lon: "76.9600", city: "Coimbatore", pincode: "641001",
  });
  const stopA = s1.data?.id;
  const stopB = s2.data?.id;

  const routeRes = await request("POST", "/api/mobility/routes", {
    routeNumber: `TR-${Date.now()}`,
    name: "Trip Route",
    origin: "Trip Stop A",
    destination: "Trip Stop B",
    city: "Coimbatore",
    stops: [
      { stopId: stopA, sequence: 1 },
      { stopId: stopB, sequence: 2 },
    ],
  });
  const testRouteId = routeRes.data?.route?.id;

  const driverRes = await request("POST", "/api/identity/drivers", {
    userId,
    licenseNumber: `TRIP-DL-${Date.now()}`,
    phone: "9999900000",
    city: "Coimbatore",
  });
  const testDriverId = driverRes.data?.driver?.id;

  // ── Create trip ──
  const create = await request("POST", "/api/mobility/trips", {
    busId: testBusId,
    routeId: testRouteId,
    driverId: testDriverId,
  });
  assert("Create trip", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const tripId = create.data?.trip?.id;
  assert("Trip status is scheduled", create.data?.trip?.status === "scheduled");

  // ── List trips ──
  const list = await request("GET", "/api/mobility/trips");
  assert("List trips", list.status === 200 && Array.isArray(list.data?.trips));

  // ── Filter by status ──
  const filtered = await request("GET", "/api/mobility/trips?status=scheduled");
  assert("Filter trips by status", filtered.status === 200 && filtered.data?.trips?.length >= 1);

  // ── Get by ID ──
  const get = await request("GET", `/api/mobility/trips/${tripId}`);
  assert("Get trip by ID", get.status === 200 && get.data?.trip?.busId === testBusId);

  // ── Start trip (scheduled → in_progress) ──
  const start = await request("PATCH", `/api/mobility/trips/${tripId}`, {
    status: "in_progress",
  });
  assert("Start trip", start.status === 200 && start.data?.trip?.status === "in_progress");
  assert("startedAt is set", !!start.data?.trip?.startedAt);

  // ── Complete trip (in_progress → completed) ──
  const complete = await request("PATCH", `/api/mobility/trips/${tripId}`, {
    status: "completed",
  });
  assert("Complete trip", complete.status === 200 && complete.data?.trip?.status === "completed");
  assert("endedAt is set", !!complete.data?.trip?.endedAt);

  // ── Delete trip ──
  const del = await request("DELETE", `/api/mobility/trips/${tripId}`);
  assert("Delete trip", del.status === 204);

  const verify = await request("GET", `/api/mobility/trips/${tripId}`);
  assert("Verify trip deleted", verify.status === 404);

  // ── Cleanup ──
  await request("DELETE", `/api/identity/drivers/${testDriverId}`);
  await request("DELETE", `/api/mobility/routes/${testRouteId}`);
  await request("DELETE", `/api/mobility/stops/${stopA}`);
  await request("DELETE", `/api/mobility/stops/${stopB}`);
  await request("DELETE", `/api/mobility/buses/${testBusId}`);
}
