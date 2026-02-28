import { request, assert } from "./helpers";

export async function testStops() {
  console.log("\n🚏 Stops CRUD");

  const create = await request("POST", "/api/mobility/stops", {
    name: "Test Stop",
    lat: "12.9716",
    lon: "77.5946",
    city: "Bengaluru",
    pincode: "560001",
  });
  assert("Create stop", create.status === 201, `status=${create.status}`);
  const stopId = create.data?.id;

  const list = await request("GET", "/api/mobility/stops");
  assert("List stops", list.status === 200 && Array.isArray(list.data));

  const get = await request("GET", `/api/mobility/stops/${stopId}`);
  assert("Get stop by ID", get.status === 200 && get.data?.name === "Test Stop");

  const update = await request("PUT", `/api/mobility/stops/${stopId}`, {
    name: "Updated Stop",
  });
  assert("Update stop", update.status === 200 && update.data?.name === "Updated Stop");

  const del = await request("DELETE", `/api/mobility/stops/${stopId}`);
  assert("Delete stop", del.status === 204);

  const verify = await request("GET", `/api/mobility/stops/${stopId}`);
  assert("Verify deleted", verify.status === 404);
}
