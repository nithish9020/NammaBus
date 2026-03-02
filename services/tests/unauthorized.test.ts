import { request, assert, setCookie, cookie } from "./helpers";

export async function testUnauthorized() {
  console.log("\n🔒 Unauthorized Access");

  const savedCookie = cookie;
  setCookie("");

  const stops = await request("GET", "/api/mobility/stops");
  assert("Stops without auth → 401", stops.status === 401);

  const drivers = await request("GET", "/api/identity/drivers");
  assert("Drivers without auth → 401", drivers.status === 401);

  const routes = await request("GET", "/api/mobility/routes");
  assert("Routes without auth → 401", routes.status === 401);

  const buses = await request("GET", "/api/mobility/buses");
  assert("Buses without auth → 401", buses.status === 401);

  const trips = await request("GET", "/api/mobility/trips");
  assert("Trips without auth → 401", trips.status === 401);

  setCookie(savedCookie);
}
