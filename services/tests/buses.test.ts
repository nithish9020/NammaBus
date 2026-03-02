import { request, assert } from "./helpers";

export async function testBuses() {
  console.log("\n🚌 Buses CRUD");

  const create = await request("POST", "/api/mobility/buses", {
    registrationNumber: `TN-43-N-${Date.now()}`,
    type: "ac",
    capacity: 40,
    city: "Coimbatore",
  });
  assert("Create bus", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const busId = create.data?.bus?.id;
  assert("Bus has correct type", create.data?.bus?.type === "ac");
  assert("Bus has correct capacity", create.data?.bus?.capacity === 40);

  const create2 = await request("POST", "/api/mobility/buses", {
    registrationNumber: `TN-43-N-${Date.now() + 1}`,
    capacity: 55,
    city: "Coimbatore",
  });
  assert("Create bus with defaults", create2.status === 201 && create2.data?.bus?.type === "regular");
  const busId2 = create2.data?.bus?.id;

  const list = await request("GET", "/api/mobility/buses");
  assert("List buses", list.status === 200 && Array.isArray(list.data?.buses));

  const get = await request("GET", `/api/mobility/buses/${busId}`);
  assert("Get bus by ID", get.status === 200 && get.data?.bus?.city === "Coimbatore");

  const update = await request("PATCH", `/api/mobility/buses/${busId}`, {
    capacity: 45,
    status: "maintenance",
  });
  assert("Update bus", update.status === 200 && update.data?.bus?.capacity === 45);
  assert("Bus status updated", update.data?.bus?.status === "maintenance");

  const del = await request("DELETE", `/api/mobility/buses/${busId}`);
  assert("Delete bus", del.status === 204);

  const verify = await request("GET", `/api/mobility/buses/${busId}`);
  assert("Verify bus deleted", verify.status === 404);

  await request("DELETE", `/api/mobility/buses/${busId2}`);
}
