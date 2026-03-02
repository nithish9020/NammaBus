import { request, assert } from "./helpers";

export async function testRoutes() {
  console.log("\n🛣️  Routes CRUD");

  const stop1 = await request("POST", "/api/mobility/stops", {
    name: "Ukkadam", lat: "11.0001", lon: "76.9500", city: "Coimbatore", pincode: "641001",
  });
  const stop2 = await request("POST", "/api/mobility/stops", {
    name: "Town Hall", lat: "11.0012", lon: "76.9600", city: "Coimbatore", pincode: "641001",
  });
  const stop3 = await request("POST", "/api/mobility/stops", {
    name: "Kovaipudur Pirivu", lat: "10.9650", lon: "76.9200", city: "Coimbatore", pincode: "641042",
  });

  const stopId1 = stop1.data?.id;
  const stopId2 = stop2.data?.id;
  const stopId3 = stop3.data?.id;

  const create = await request("POST", "/api/mobility/routes", {
    routeNumber: `T-${Date.now()}`,
    name: "Ukkadam - Kovaipudur Pirivu",
    origin: "Ukkadam",
    destination: "Kovaipudur Pirivu",
    city: "Coimbatore",
    stops: [
      { stopId: stopId1, sequence: 1 },
      { stopId: stopId2, sequence: 2 },
      { stopId: stopId3, sequence: 3 },
    ],
  });
  assert("Create route", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const routeId = create.data?.route?.id;
  assert("Route has 3 stops", create.data?.route?.stops?.length === 3);
  assert("Stops are ordered", create.data?.route?.stops?.[0]?.stop?.name === "Ukkadam");

  const list = await request("GET", "/api/mobility/routes");
  assert("List routes", list.status === 200 && !!list.data?.routes);

  const get = await request("GET", `/api/mobility/routes/${routeId}`);
  assert("Get route by ID", get.status === 200 && get.data?.route?.stops?.length === 3);

  const update = await request("PATCH", `/api/mobility/routes/${routeId}`, {
    name: "Ukkadam - Kovai Pudur",
    status: "inactive",
  });
  assert("Update route metadata", update.status === 200 && update.data?.route?.name === "Ukkadam - Kovai Pudur");

  const replaceStops = await request("PUT", `/api/mobility/routes/${routeId}/stops`, {
    stops: [
      { stopId: stopId1, sequence: 1 },
      { stopId: stopId3, sequence: 2 },
    ],
  });
  assert("Replace route stops", replaceStops.status === 200 && replaceStops.data?.route?.stops?.length === 2);

  const del = await request("DELETE", `/api/mobility/routes/${routeId}`);
  assert("Delete route", del.status === 204);

  const verify = await request("GET", `/api/mobility/routes/${routeId}`);
  assert("Verify route deleted", verify.status === 404);

  await request("DELETE", `/api/mobility/stops/${stopId1}`);
  await request("DELETE", `/api/mobility/stops/${stopId2}`);
  await request("DELETE", `/api/mobility/stops/${stopId3}`);
}
