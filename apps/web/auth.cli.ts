import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";
import { ac, adminRole, securityOfficerRole } from "./lib/permissions";

const db = drizzle(process.env.DATABASE_URL!);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  plugins: [
    adminPlugin({
      ac,
      roles: { admin: adminRole, security_officer: securityOfficerRole },
      defaultRole: "security_officer",
    }),
  ],
});