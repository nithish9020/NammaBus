import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

async function main() {
  const sql = neon(process.env.NEON_DATABASE_URL!);

  const migrationsDir = "./drizzle";

  // Get all .sql files sorted by name
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    process.exit(0);
  }

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const rawSql = readFileSync(filePath, "utf-8");

    // Split on drizzle's statement breakpoint marker
    const statements = rawSql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`📄 Running ${file} (${statements.length} statements)...`);

    for (const stmt of statements) {
      try {
        // Use tagged template literal workaround for neon()
        await sql(Object.assign([stmt], { raw: [stmt] }) as any);
      } catch (err: any) {
        // Skip "already exists" errors so migrations are re-runnable
        if (
          err?.code === "42P07" || 
          err?.code === "42710" || 
          err?.code === "42701" // "duplicate column" code
        ) {
          console.log(`   ⏭️  Skipped (already exists)`);
        } else {
          throw err;
        }
      }
    }

    console.log(`   ✅ ${file} done`);
  }

  console.log("\n✅ All migrations completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
