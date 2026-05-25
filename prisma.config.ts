import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  ...(process.env.DIRECT_URL && {
    datasource: { url: process.env.DIRECT_URL },
  }),
});
