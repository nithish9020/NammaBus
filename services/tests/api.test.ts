import { env } from '../src/lib/env';

const BASE_URL = env?.BASE_URL || "http://localhost:3000";

// ─── State ─────────────────────────────────────────────────
let cookie = "";        // session cookie from sign-in
let userId = "";        // signed-in user's ID (needed to create drivers/conductors)
let passed = 0;
let failed = 0;

// ─── Helpers ───────────────────────────────────────────────
async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: BASE_URL,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });

  // Capture set-cookie header from sign-in
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    cookie = setCookie.split(";")[0]; // grab just the token part
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, data };
}

function assert(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

// ─── Test Suites ───────────────────────────────────────────

async function testAuth() {
  console.log("\n🔐 Auth");

  // Sign in
  const { status, data } = await request("POST", "/api/auth/sign-in/email", {
    email: "nithish@nammabus.dev",
    password: "pass1234",
  });
  assert("Sign in", status === 200, `status=${status}`);
  assert("Returns user object", !!data?.user?.id, JSON.stringify(data));

  userId = data?.user?.id || "";

  // Get session
  const session = await request("GET", "/api/auth/get-session");
  assert("Get session", session.status === 200);
}

async function testStops() {
  console.log("\n🚏 Stops CRUD");

  // Create
  const create = await request("POST", "/api/mobility/stops", {
    name: "Test Stop",
    lat: "12.9716",
    lon: "77.5946",
    city: "Bengaluru",
    pincode: "560001",
  });
  assert("Create stop", create.status === 201, `status=${create.status}`);
  const stopId = create.data?.id;

  // List
  const list = await request("GET", "/api/mobility/stops");
  assert("List stops", list.status === 200 && Array.isArray(list.data));

  // Get by ID
  const get = await request("GET", `/api/mobility/stops/${stopId}`);
  assert("Get stop by ID", get.status === 200 && get.data?.name === "Test Stop");

  // Update
  const update = await request("PUT", `/api/mobility/stops/${stopId}`, {
    name: "Updated Stop",
  });
  assert("Update stop", update.status === 200 && update.data?.name === "Updated Stop");

  // Delete
  const del = await request("DELETE", `/api/mobility/stops/${stopId}`);
  assert("Delete stop", del.status === 204);

  // Verify deleted
  const verify = await request("GET", `/api/mobility/stops/${stopId}`);
  assert("Verify deleted", verify.status === 404);
}

async function testDrivers() {
  console.log("\n🚌 Drivers CRUD");

  // Create
  const create = await request("POST", "/api/identity/drivers", {
    userId,
    licenseNumber: `TEST-DL-${Date.now()}`,
    phone: "9876543210",
    city: "Bengaluru",
  });
  assert("Create driver", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const driverId = create.data?.driver?.id;

  // List
  const list = await request("GET", "/api/identity/drivers");
  assert("List drivers", list.status === 200 && !!list.data?.drivers);

  // Get by ID
  const get = await request("GET", `/api/identity/drivers/${driverId}`);
  assert("Get driver by ID", get.status === 200 && get.data?.driver?.phone === "9876543210");

  // Update (PATCH)
  const update = await request("PATCH", `/api/identity/drivers/${driverId}`, {
    city: "Mysuru",
    status: "inactive",
  });
  assert("Update driver", update.status === 200 && update.data?.driver?.city === "Mysuru");

  // Delete
  const del = await request("DELETE", `/api/identity/drivers/${driverId}`);
  assert("Delete driver", del.status === 204);

  // Verify deleted
  const verify = await request("GET", `/api/identity/drivers/${driverId}`);
  assert("Verify deleted", verify.status === 404);
}

async function testConductors() {
  console.log("\n🎫 Conductors CRUD");

  // Create
  const create = await request("POST", "/api/identity/conductors", {
    userId,
    badgeNumber: `TEST-BD-${Date.now()}`,
    phone: "9123456789",
    city: "Bengaluru",
  });
  assert("Create conductor", create.status === 201, `status=${create.status} ${JSON.stringify(create.data)}`);
  const conductorId = create.data?.conductor?.id;

  // List
  const list = await request("GET", "/api/identity/conductors");
  assert("List conductors", list.status === 200 && !!list.data?.conductors);

  // Get by ID
  const get = await request("GET", `/api/identity/conductors/${conductorId}`);
  assert("Get conductor by ID", get.status === 200 && get.data?.conductor?.phone === "9123456789");

  // Update (PATCH)
  const update = await request("PATCH", `/api/identity/conductors/${conductorId}`, {
    city: "Hubli",
    status: "suspended",
  });
  assert("Update conductor", update.status === 200 && update.data?.conductor?.city === "Hubli");

  // Delete
  const del = await request("DELETE", `/api/identity/conductors/${conductorId}`);
  assert("Delete conductor", del.status === 204);

  // Verify deleted
  const verify = await request("GET", `/api/identity/conductors/${conductorId}`);
  assert("Verify deleted", verify.status === 404);
}

async function testUnauthorized() {
  console.log("\n🔒 Unauthorized Access");

  // Save cookie, clear it, test, restore
  const savedCookie = cookie;
  cookie = "";

  const stops = await request("GET", "/api/mobility/stops");
  assert("Stops without auth → 401", stops.status === 401);

  const drivers = await request("GET", "/api/identity/drivers");
  assert("Drivers without auth → 401", drivers.status === 401);

  const routes = await request("GET", "/api/mobility/routes");
  assert("Routes without auth → 401", routes.status === 401);

  cookie = savedCookie;
}

async function testRoutes() {
  console.log("\n🛣️  Routes CRUD");

  // First, create 3 stops to use in our route
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

  // Create route with 3 stops
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

  // List routes
  const list = await request("GET", "/api/mobility/routes");
  assert("List routes", list.status === 200 && !!list.data?.routes);

  // Get by ID (with stops populated)
  const get = await request("GET", `/api/mobility/routes/${routeId}`);
  assert("Get route by ID", get.status === 200 && get.data?.route?.stops?.length === 3);

  // Update metadata (PATCH)
  const update = await request("PATCH", `/api/mobility/routes/${routeId}`, {
    name: "Ukkadam - Kovai Pudur",
    status: "inactive",
  });
  assert("Update route metadata", update.status === 200 && update.data?.route?.name === "Ukkadam - Kovai Pudur");

  // Replace stops (PUT /routes/:id/stops) — remove middle stop
  const replaceStops = await request("PUT", `/api/mobility/routes/${routeId}/stops`, {
    stops: [
      { stopId: stopId1, sequence: 1 },
      { stopId: stopId3, sequence: 2 },
    ],
  });
  assert("Replace route stops", replaceStops.status === 200 && replaceStops.data?.route?.stops?.length === 2);

  // Delete route
  const del = await request("DELETE", `/api/mobility/routes/${routeId}`);
  assert("Delete route", del.status === 204);

  // Verify deleted
  const verify = await request("GET", `/api/mobility/routes/${routeId}`);
  assert("Verify route deleted", verify.status === 404);

  // Cleanup: delete the test stops
  await request("DELETE", `/api/mobility/stops/${stopId1}`);
  await request("DELETE", `/api/mobility/stops/${stopId2}`);
  await request("DELETE", `/api/mobility/stops/${stopId3}`);
}

async function testSignOut() {
  console.log("\n👋 Sign Out");

  const { status } = await request("POST", "/api/auth/sign-out");
  assert("Sign out", status === 200);

  // Verify session is gone
  const session = await request("GET", "/api/auth/get-session");
  assert("Session invalidated", session.status !== 200 || !session.data?.session);
}

// ─── Runner ────────────────────────────────────────────────
async function run() {
  console.log(`\n🧪 NammaBus API Tests — ${BASE_URL}\n${"─".repeat(50)}`);

  await testAuth();
  await testStops();
  await testDrivers();
  await testConductors();
  await testRoutes();
  await testUnauthorized();
  await testSignOut();

  console.log(`\n${"─".repeat(50)}`);
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log(`${failed === 0 ? "🎉 All tests passed!" : "⚠️  Some tests failed!"}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("❌ Test runner crashed:", err);
  process.exit(1);
});
