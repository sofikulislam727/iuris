import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// First file wins when a variable appears in both.
config({ path: [".env.local", ".env"] });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to apps/web/.env.local");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});