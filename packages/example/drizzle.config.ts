import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 schema: "./drizzle/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
  },
  verbose: true,
  strict: true,
})
