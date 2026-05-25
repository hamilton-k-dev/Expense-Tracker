import { defineConfig } from "prisma/config";
import path from "node:path";
import { config } from "dotenv";

config({ path: ".env" });

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  ...(url && { datasource: { url } }),
});
