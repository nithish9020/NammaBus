import { auth } from "../lib/auth";

// Seed 4 users with domain-based emails
// Uses Better Auth's API so passwords are properly hashed
// and account rows are created correctly.

const seedUsers = [
  { name: "Nithish Kumar", email: "nithish@nammabus.dev", password: "pass1234" },
  { name: "Priya Sharma", email: "priya@nammabus.dev", password: "pass1234" },
  { name: "Ravi Driver", email: "ravi@nammabus.dev", password: "pass1234" },
  { name: "Admin User", email: "admin@nammabus.dev", password: "pass1234" },
];

async function seed() {
  console.log("🌱 Seeding users...\n");

  for (const u of seedUsers) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          name: u.name,
          email: u.email,
          password: u.password,
        },
      });

      console.log(`✅ ${u.email} → id: ${result.user.id}`);
    } catch (err: any) {
      // If user already exists, skip
      if (err?.message?.includes("already") || err?.status === 422) {
        console.log(`⏭️  ${u.email} already exists, skipping`);
      } else {
        console.error(`❌ ${u.email} failed:`, err?.message || err);
      }
    }
  }

  console.log("\n🌱 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
