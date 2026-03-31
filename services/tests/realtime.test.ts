import WebSocket from "ws";
import Redis from "ioredis";
import { request, assert, cookie, userId, BASE_URL } from "./helpers";
import { env } from "../src/lib/env";

// ─── Helpers ───────────────────────────────────────────────
const WS_URL = BASE_URL.replace(/^http/, "ws") + "/ws";

/** Open an authenticated WebSocket (passes session cookie) */
function openWs(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL, { headers: { Cookie: cookie } });
    ws.on("open", () => resolve(ws));
    ws.on("error", reject);
  });
}

/** Open a raw WebSocket WITHOUT auth (for rejection tests) */
function openWsNoAuth(): Promise<{ rejected: boolean; code?: number }> {
  return new Promise((resolve) => {
    const ws = new WebSocket(WS_URL);
    const timeout = setTimeout(() => resolve({ rejected: false }), 5000);
    // Bun fires close with code 1002 for rejected upgrades
    // Node fires unexpected-response with HTTP status
    ws.on("close", (code) => {
      clearTimeout(timeout);
      resolve({ rejected: true, code });
    });
    ws.on("open", () => {
      clearTimeout(timeout);
      ws.close();
      resolve({ rejected: false });
    });
    ws.on("error", () => {
      // error fires alongside close, ignore it
    });
  });
}

/** Drain all pending messages so the next .once("message") is clean */
function drainMessages(ws: WebSocket, ms = 200): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {}; // eat any stale messages
    ws.on("message", handler);
    setTimeout(() => {
      ws.removeListener("message", handler);
      resolve();
    }, ms);
  });
}

/** Send a JSON message and wait for the next incoming message */
function sendAndReceive(ws: WebSocket, msg: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("WS reply timeout")), 5000);
    // Register listener BEFORE sending so we never miss the reply
    const handler = (raw: WebSocket.RawData) => {
      clearTimeout(timeout);
      ws.removeListener("message", handler);
      try {
        resolve(JSON.parse(raw.toString()));
      } catch {
        reject(new Error("Invalid JSON from server"));
      }
    };
    ws.on("message", handler);
    ws.send(JSON.stringify(msg));
  });
}

/** Wait for the next incoming message (without sending anything) */
function waitForMessage(ws: WebSocket, timeoutMs = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("WS message timeout")), timeoutMs);
    const handler = (raw: WebSocket.RawData) => {
      clearTimeout(timeout);
      ws.removeListener("message", handler);
      try {
        resolve(JSON.parse(raw.toString()));
      } catch {
        reject(new Error("Invalid JSON from server"));
      }
    };
    ws.on("message", handler);
  });
}

function closeWs(ws: WebSocket): Promise<void> {
  return new Promise((resolve) => {
    if (ws.readyState === WebSocket.CLOSED) return resolve();
    ws.on("close", () => resolve());
    ws.close();
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Tests ─────────────────────────────────────────────────
export async function testRealtime() {
  console.log("\n🔴 Realtime (WebSocket + Redis)");

  // ─── 1. Unauthenticated WS → rejected ──────────────────
  try {
    const { rejected, code } = await openWsNoAuth();
    assert("WS without auth → rejected", rejected === true, `rejected=${rejected} code=${code}`);
  } catch (err: any) {
    assert("WS without auth → rejected", false, err.message);
  }

  // ─── 2. Authenticated WS connect ───────────────────────
  let ws1: WebSocket | null = null;
  try {
    ws1 = await openWs();
    assert("WS connect (with cookie)", ws1.readyState === WebSocket.OPEN);
  } catch (err: any) {
    assert("WS connect (with cookie)", false, err.message);
    return; // can't continue without a connection
  }

  // ─── 3. Ping / Pong ────────────────────────────────────
  try {
    const pong = await sendAndReceive(ws1, { type: "ping" });
    assert("Ping → Pong", pong.type === "pong");
  } catch (err: any) {
    assert("Ping → Pong", false, err.message);
  }

  // ─── 4. Subscribe to a trip ─────────────────────────────
  const fakeTripId = "00000000-0000-0000-0000-000000000001";
  await drainMessages(ws1);
  try {
    const ack = await sendAndReceive(ws1, { type: "subscribe", tripId: fakeTripId });
    assert("Subscribe → ack", ack.type === "subscribed" && ack.tripId === fakeTripId);
  } catch (err: any) {
    assert("Subscribe → ack", false, err.message);
  }

  // ─── 5. Subscribe without tripId → error ────────────────
  try {
    const errMsg = await sendAndReceive(ws1, { type: "subscribe" });
    assert("Subscribe no tripId → error", errMsg.type === "error" && errMsg.message.includes("tripId"));
  } catch (err: any) {
    assert("Subscribe no tripId → error", false, err.message);
  }

  // ─── 6. Unknown message type → error ────────────────────
  try {
    const errMsg = await sendAndReceive(ws1, { type: "foobar" });
    assert("Unknown type → error", errMsg.type === "error" && errMsg.message.includes("foobar"));
  } catch (err: any) {
    assert("Unknown type → error", false, err.message);
  }

  // ─── 7. Invalid JSON → error ────────────────────────────
  try {
    const reply = await new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("timeout")), 5000);
      ws1!.once("message", (raw) => {
        clearTimeout(timeout);
        resolve(JSON.parse(raw.toString()));
      });
      ws1!.send("not-json{{{");
    });
    assert("Invalid JSON → error", reply.type === "error" && reply.message.includes("Invalid JSON"));
  } catch (err: any) {
    assert("Invalid JSON → error", false, err.message);
  }

  // ─── 8. Redis pub/sub → WebSocket broadcast ─────────────
  // Publish a GPS payload directly to Redis on trip channel,
  // and verify the subscribed WebSocket client receives it.
  let redisPub: Redis | null = null;
  try {
    redisPub = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 3 });
    await redisPub.connect();

    const gpsPayload = {
      type: "bus:location",
      tripId: fakeTripId,
      busId: "bus-test-001",
      lat: "11.0001",
      lon: "76.9500",
      speed: "30.00",
      heading: "90.00",
      recordedAt: new Date().toISOString(),
    };

    // Set up listener BEFORE publishing
    const broadcastPromise = waitForMessage(ws1);
    await redisPub.publish(`trip:${fakeTripId}`, JSON.stringify(gpsPayload));

    const received = await broadcastPromise;
    assert(
      "Redis publish → WS broadcast",
      received.tripId === fakeTripId && received.lat === "11.0001" && received.type === "bus:location",
      `received: ${JSON.stringify(received)}`
    );
  } catch (err: any) {
    assert("Redis publish → WS broadcast", false, err.message);
  }

  // ─── 9. Subscribe sends cached latest position ──────────
  // If a driver has been posting GPS, a new subscriber should
  // immediately receive the last known position from Redis.
  try {
    const cachedTrip = "00000000-0000-0000-0000-000000000099";
    const cachedPayload = {
      type: "bus:location",
      tripId: cachedTrip,
      busId: "bus-cached-001",
      lat: "12.3456",
      lon: "77.6543",
      speed: "40.00",
      heading: "180.00",
      recordedAt: new Date().toISOString(),
    };

    // Pre-set the latest position in Redis
    await redisPub!.set(`trip:${cachedTrip}:latest`, JSON.stringify(cachedPayload));

    // Open a fresh client and subscribe — should get subscribed ack + latest
    const ws3 = await openWs();
    const ack = await sendAndReceive(ws3, { type: "subscribe", tripId: cachedTrip });
    assert("Cached latest → subscribe ack", ack.type === "subscribed" && ack.tripId === cachedTrip);

    const latest = await waitForMessage(ws3, 3000);
    assert(
      "Cached latest → sent on subscribe",
      latest.type === "bus:location" && latest.tripId === cachedTrip && latest.lat === "12.3456",
      `received: ${JSON.stringify(latest)}`
    );

    // Cleanup
    await redisPub!.del(`trip:${cachedTrip}:latest`);
    await closeWs(ws3);
  } catch (err: any) {
    assert("Cached latest → sent on subscribe", false, err.message);
  }

  // ─── 10. Second client on same trip ─────────────────────
  let ws2: WebSocket | null = null;
  try {
    ws2 = await openWs();
    await sendAndReceive(ws2, { type: "subscribe", tripId: fakeTripId });

    const gpsPayload2 = {
      type: "bus:location",
      tripId: fakeTripId,
      busId: "bus-test-002",
      lat: "11.0010",
      lon: "76.9550",
      speed: "25.00",
      heading: "85.00",
      recordedAt: new Date().toISOString(),
    };

    const p1 = waitForMessage(ws1);
    const p2 = waitForMessage(ws2);
    await redisPub!.publish(`trip:${fakeTripId}`, JSON.stringify(gpsPayload2));

    const [msg1, msg2] = await Promise.all([p1, p2]);
    assert(
      "Broadcast reaches both clients",
      msg1.busId === "bus-test-002" && msg2.busId === "bus-test-002"
    );
  } catch (err: any) {
    assert("Broadcast reaches both clients", false, err.message);
  }

  // ─── 11. Unsubscribe → no more broadcasts ──────────────
  try {
    const unsub = await sendAndReceive(ws1, { type: "unsubscribe", tripId: fakeTripId });
    assert("Unsubscribe → ack", unsub.type === "unsubscribed" && unsub.tripId === fakeTripId);

    // Publish again — ws1 should NOT receive, ws2 should
    const gpsPayload3 = {
      type: "bus:location",
      tripId: fakeTripId,
      busId: "bus-test-003",
      lat: "11.0020",
      lon: "76.9600",
      speed: "20.00",
      heading: "80.00",
      recordedAt: new Date().toISOString(),
    };

    const ws2Promise = waitForMessage(ws2!);
    let ws1GotMessage = false;
    ws1.once("message", () => { ws1GotMessage = true; });

    await redisPub!.publish(`trip:${fakeTripId}`, JSON.stringify(gpsPayload3));
    await ws2Promise; // ws2 should receive
    await sleep(500); // give ws1 a moment to NOT receive

    assert("Unsubscribed client gets no broadcast", !ws1GotMessage);
  } catch (err: any) {
    assert("Unsubscribed client gets no broadcast", false, err.message);
  }

  // ─── 12. /api/realtime/stats endpoint ─────────────────-
  try {
    const stats = await request("GET", "/api/realtime/stats");
    assert(
      "GET /api/realtime/stats",
      stats.status === 200 && typeof stats.data.totalRooms === "number" && typeof stats.data.totalWatchers === "number",
      `status=${stats.status} data=${JSON.stringify(stats.data)}`
    );
  } catch (err: any) {
    assert("GET /api/realtime/stats", false, err.message);
  }

  // ─── 13. End-to-end: HTTP GPS POST → WS broadcast ─────
  // Create a real trip, POST locations via HTTP, verify WS client receives broadcast
  let locBusId: string | null = null;
  let locStopA: string | null = null;
  let locStopB: string | null = null;
  let locRouteId: string | null = null;
  let locDriverId: string | null = null;
  let locTripId: string | null = null;

  try {
    // Setup: bus, stops, route, driver, trip
    const busRes = await request("POST", "/api/mobility/buses", {
      registrationNumber: `TN-RT-${Date.now()}`, capacity: 40, city: "Coimbatore",
    });
    locBusId = busRes.data?.bus?.id;

    const s1 = await request("POST", "/api/mobility/stops", {
      name: "RT Stop A", lat: "11.0001", lon: "76.9500", city: "Coimbatore", pincode: "641001",
    });
    const s2 = await request("POST", "/api/mobility/stops", {
      name: "RT Stop B", lat: "11.0050", lon: "76.9700", city: "Coimbatore", pincode: "641001",
    });
    locStopA = s1.data?.id;
    locStopB = s2.data?.id;

    const routeRes = await request("POST", "/api/mobility/routes", {
      routeNumber: `RTR-${Date.now()}`, name: "RT Route", origin: "RT Stop A", destination: "RT Stop B",
      city: "Coimbatore", stops: [{ stopId: locStopA, sequence: 1 }, { stopId: locStopB, sequence: 2 }],
    });
    locRouteId = routeRes.data?.route?.id;

    const driverRes = await request("POST", "/api/identity/drivers", {
      userId,
      licenseNumber: `RT-DL-${Date.now()}`, phone: "9999900000", city: "Coimbatore",
    });
    locDriverId = driverRes.data?.driver?.id;

    const tripRes = await request("POST", "/api/mobility/trips", {
      busId: locBusId, routeId: locRouteId, driverId: locDriverId,
    });
    locTripId = tripRes.data?.trip?.id;

    if (!locTripId) throw new Error("Failed to create trip for E2E test");

    // Subscribe ws2 to the real trip
    await sendAndReceive(ws2!, { type: "subscribe", tripId: locTripId });

    // POST GPS locations via HTTP
    const broadcastPromise = waitForMessage(ws2!);
    const addLocs = await request("POST", `/api/mobility/trips/${locTripId}/locations`, {
      locations: [{ lat: "11.0001", lon: "76.9500", speed: "25.50", heading: "90.00" }],
    });

    assert("E2E: HTTP POST locations", addLocs.status === 201, `status=${addLocs.status}`);

    const broadcast = await broadcastPromise;
    assert(
      "E2E: GPS POST → Redis → WS broadcast",
      broadcast.tripId === locTripId && broadcast.type === "bus:location" && parseFloat(broadcast.lat) === 11.0001,
      `received: ${JSON.stringify(broadcast)}`
    );
  } catch (err: any) {
    assert("E2E: GPS POST → Redis → WS broadcast", false, err.message);
  }

  // ─── 14. Trip end cleanup ──────────────────────────────
  // When a trip is completed, subscribers should receive { type: "trip:ended" }
  // and the Redis trip:<id>:latest key should be deleted.
  try {
    if (!locTripId) throw new Error("No trip from E2E test to complete");

    // ws2 is already subscribed to locTripId from the E2E test above.
    // Start the trip first (scheduled → in_progress)
    await request("PATCH", `/api/mobility/trips/${locTripId}`, { status: "in_progress" });

    // Post a GPS location so Redis trip:<id>:latest exists
    await request("POST", `/api/mobility/trips/${locTripId}/locations`, {
      locations: [{ lat: "11.0010", lon: "76.9550", speed: "30.00", heading: "90.00" }],
    });

    // Drain the bus:location broadcast from the GPS post above
    await drainMessages(ws2!, 500);

    // Verify Redis key exists before completing
    const before = await redisPub!.get(`trip:${locTripId}:latest`);
    assert("Trip end: Redis latest exists before", !!before);

    // Complete the trip → should trigger trip:ended broadcast + Redis DEL
    const endedPromise = waitForMessage(ws2!, 5000);
    await request("PATCH", `/api/mobility/trips/${locTripId}`, { status: "completed" });

    const ended = await endedPromise;
    assert(
      "Trip end: trip:ended broadcast",
      ended.type === "trip:ended" && ended.tripId === locTripId,
      `received: ${JSON.stringify(ended)}`
    );

    // Give Redis DEL a moment to complete (fire-and-forget)
    await sleep(300);
    const after = await redisPub!.get(`trip:${locTripId}:latest`);
    assert("Trip end: Redis latest deleted", after === null, `still exists: ${after}`);
  } catch (err: any) {
    assert("Trip end: trip:ended broadcast", false, err.message);
  }

  // ─── Cleanup ────────────────────────────────────────────
  if (locTripId) await request("DELETE", `/api/mobility/trips/${locTripId}`);
  if (locDriverId) await request("DELETE", `/api/identity/drivers/${locDriverId}`);
  if (locRouteId) await request("DELETE", `/api/mobility/routes/${locRouteId}`);
  if (locStopA) await request("DELETE", `/api/mobility/stops/${locStopA}`);
  if (locStopB) await request("DELETE", `/api/mobility/stops/${locStopB}`);
  if (locBusId) await request("DELETE", `/api/mobility/buses/${locBusId}`);

  if (ws2) await closeWs(ws2);
  if (ws1) await closeWs(ws1);
  if (redisPub) redisPub.disconnect();
}
