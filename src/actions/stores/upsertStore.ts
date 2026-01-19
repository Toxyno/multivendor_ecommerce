//Function: upsertStore
//Description: This function is used to create or update a store in the database ensuring uniqueness of name, url, email and phone number .
//Permission Level: Seller Only
//Parameters:
// -Store: Partial Store object containing the details of the store to be upserted
// Returns: Updated or newly created Store object.....#

"use server";

import "server-only";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// Use an input type instead of Prisma's Category model (safer for client->server)
type upsertStoreInput = {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  url: string;
  status: string;
  featured: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function upsertStore(store: Partial<upsertStoreInput>) {
  try {
    // get the current user
    const user = await currentUser();

    //Ensure the user is authenticated
    if (!user) throw new Error("Unauthenticated user");

    //Ensure the user has the seller role
    const role = (
      user.privateMetadata?.role as string | undefined
    )?.toUpperCase();
    if (role !== "SELLER") throw new Error("Unauthorized user");

    if (!store) throw new Error("Store data is required");
    if (!store.name?.trim()) throw new Error("Store name is required");
    if (!store.url?.trim()) throw new Error("Store url is required");

    const existing = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { url: store.url },
              { email: store.email },
              { phone: store.phone },
            ],
          },
          { NOT: { id: store.id ?? "" } },
        ],
      },
    });

    if (existing) {
      let errorMessage = "";
      if (existing.name === store.name) {
        errorMessage = "Store with the same name already exists";
      }
      if (existing.url === store.url) {
        errorMessage = "Store with the same URL already exists";
      }
      if (existing.email === store.email) {
        errorMessage = "Store with the same email already exists";
      }
      if (existing.phone === store.phone) {
        errorMessage = "Store with the same phone number already exists";
      }
      throw new Error(errorMessage);
    }

    return await db.store.upsert({
      where: { id: store.id ?? "" },
      update: {
        name: store.name ?? "",
        url: store.url ?? "",
        featured: store.featured ?? false,
        logo: store.logo ?? "",
        cover: store.cover ?? "",
        description: store.description ?? "",
        email: store.email ?? "",
        phone: store.phone ?? "",
      },
      create: {
        id: store.id ?? undefined,
        name: store.name ?? "",
        url: store.url ?? "",
        featured: store.featured ?? false,
        logo: store.logo ?? "",
        cover: store.cover ?? "",
        description: store.description ?? "",
        email: store.email ?? "",
        phone: store.phone ?? "",

        owner: {
          connect: { Id: user.id }, // Associate the store with the current user
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to upsert store: ${(error as Error).message}`);
  }
}
