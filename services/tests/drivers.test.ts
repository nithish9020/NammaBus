import { request, assert, userId } from "./helpers";

export async function testDrivers() {
  console.log("\n🚌 Drivers CRUD");

  const create = await request("POST", "/api/identity/drivers", {
    userId,
    licenseNumber: `TEST-DL-${Date.now()}`,
    phone: "9876543210",
    city: "Bengaluru",
  });
  assert("Create driver", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const driverId = create.data?.driver?.id;

  const list = await request("GET", "/api/identity/drivers");
  assert("List drivers", list.status === 200 && !!list.data?.drivers);

  const get = await request("GET", `/api/identity/drivers/${driverId}`);
  assert("Get driver by ID", get.status === 200 && get.data?.driver?.phone === "9876543210");

  const update = await request("PATCH", `/api/identity/drivers/${driverId}`, {
    city: "Mysuru",
    status: "inactive",
  });
  assert("Update driver", update.status === 200 && update.data?.driver?.city === "Mysuru");

  const del = await request("DELETE", `/api/identity/drivers/${driverId}`);
  assert("Delete driver", del.status === 204);

  const verify = await request("GET", `/api/identity/drivers/${driverId}`);
  assert("Verify deleted", verify.status === 404);
}
