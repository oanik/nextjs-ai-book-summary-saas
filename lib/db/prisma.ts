import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../prisma/generated/prisma/client';

import 'dotenv/config';

const globalForPrisma = globalThis as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required.');
}

const parsedDatabaseUrl = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: parsedDatabaseUrl.hostname,
  port: parsedDatabaseUrl.port ? Number(parsedDatabaseUrl.port) : 3306,
  user: decodeURIComponent(parsedDatabaseUrl.username),
  password: decodeURIComponent(parsedDatabaseUrl.password),
  database: parsedDatabaseUrl.pathname.replace(/^\//, ''),
  // Important for local MySQL 8 auth flow
  allowPublicKeyRetrieval: parsedDatabaseUrl.searchParams.get('allowPublicKeyRetrieval') !== 'false',
  // Common local Docker default (no TLS)
  ssl: parsedDatabaseUrl.searchParams.get('ssl') === 'true',
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
