import { defineConfig } from 'prisma/config';

import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx lib/db/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'mysql://localhost:3306/bookwise',
  },
});
