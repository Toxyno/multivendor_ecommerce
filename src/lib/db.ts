import "server-only";

import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

// PrismaMariaDb expects a connection string or a PoolConfig (not a Pool instance).
// Pass the connection string directly. If you need a mariadb pool elsewhere,
// create it separately.
const adapter = new PrismaMariaDb(connectionString);

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// import { PrismaClient } from "@/generated/prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
