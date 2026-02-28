import { request, assert, setUserId } from "./helpers";

export async function testAuth() {
  console.log("\n🔐 Auth");

  const { status, data } = await request("POST", "/api/auth/sign-in/email", {
    email: "nithish@nammabus.dev",
    password: "pass1234",
  });
  assert("Sign in", status === 200, `status=${status}`);
  assert("Returns user object", !!data?.user?.id, JSON.stringify(data));

  setUserId(data?.user?.id || "");

  const session = await request("GET", "/api/auth/get-session");
  assert("Get session", session.status === 200);
}

export async function testSignOut() {
  console.log("\n👋 Sign Out");

  const { status } = await request("POST", "/api/auth/sign-out");
  assert("Sign out", status === 200);

  const session = await request("GET", "/api/auth/get-session");
  assert("Session invalidated", session.status !== 200 || !session.data?.session);
}
