import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",

  trustedOrigins: [
    "http://localhost:5173",        // local Vite dev server
    "http://localhost:4173",        // local Vite preview
    process.env.FRONTEND_URL || "", // Vercel prod URL (set in Render env vars)
  ].filter(Boolean),

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  // Generate proper UUIDs since our id columns are uuid type
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`\n📧 ──── OTP for ${email} ────`);
        console.log(`   Type : ${type}`);
        console.log(`   Code : ${otp}`);
        console.log(`   ─────────────────────────\n`);
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 300,
    }),
  ],
});