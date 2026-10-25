import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { auth } from "../auth.cli";
import { user } from "../db/schema";

const email = process.env.ADMIN_EMAIL;
const name = process.env.ADMIN_NAME;
const password = process.env.ADMIN_PASSWORD;

if (!email || !name || !password) {
  throw new Error("Set ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD");
}

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await auth.api.signUpEmail({ body: { email: email!, name: name!, password: password! } });
  await db
    .update(user)
    .set({ role: "admin", emailVerified: true })
    .where(eq(user.email, email!.toLowerCase()));
  console.log("Admin created:", email);
}

main().catch((e) => {
  console.error("Failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});