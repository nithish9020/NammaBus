import { passed, failed } from "./helpers";
import { testAuth, testSignOut } from "./auth.test";
import { testStops } from "./stops.test";
import { testRoutes } from "./routes.test";
import { testBuses } from "./buses.test";
import { testDrivers } from "./drivers.test";
import { testConductors } from "./conductors.test";
import { testTrips } from "./trips.test";
import { testTripLocations } from "./tripLocations.test";
import { testRealtime } from "./realtime.test";
import { testUnauthorized } from "./unauthorized.test";

async function run() {
  console.log("🧪 NammaBus API Tests\n");

  await testAuth();
  await testStops();
  await testDrivers();
  await testConductors();
  await testRoutes();
  await testBuses();
  await testTrips();
  await testTripLocations();
  await testRealtime();
  await testUnauthorized();
  await testSignOut();

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
