// src/lib/utils.server.ts (server-only)
import "server-only";
import type { PrismaClient } from "@/generated/prisma/client"; // use your server client type
import { db } from "@/lib/db";

export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  seperator: string = "-"
) => {
  let slug = baseSlug;
  let uniqueSuffix = 1;

  while (true) {
    const existing = await (db[model] as any).findFirst({
      where: { [field]: slug },
      select: { [field]: true },
    });

    if (!existing) break;

    slug = `${baseSlug}${seperator}${uniqueSuffix}`;
    uniqueSuffix++;
  }

  return slug;
};
