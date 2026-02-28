import { request, assert, userId } from "./helpers";

export async function testConductors() {
  console.log("\n🎫 Conductors CRUD");

  const create = await request("POST", "/api/identity/conductors", {
    userId,
    badgeNumber: `TEST-BD-${Date.now()}`,
    phone: "9123456789",
    city: "Bengaluru",
  });
  assert("Create conductor", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const conductorId = create.data?.conductor?.id;

  const list = await request("GET", "/api/identity/conductors");
  assert("List conductors", list.status === 200 && !!list.data?.conductors);

  const get = await request("GET", `/api/identity/conductors/${conductorId}`);
  assert("Get conductor by ID", get.status === 200 && get.data?.conductor?.phone === "9123456789");

  const update = await request("PATCH", `/api/identity/conductors/${conductorId}`, {
    city: "Hubli",
    status: "suspended",
  });
  assert("Update conductor", update.status === 200 && update.data?.conductor?.city === "Hubli");

  const del = await request("DELETE", `/api/identity/conductors/${conductorId}`);
  assert("Delete conductor", del.status === 204);

  const verify = await request("GET", `/api/identity/conductors/${conductorId}`);
  assert("Verify deleted", verify.status === 404);
}
