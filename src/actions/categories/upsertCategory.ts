//Function: upsertCategory
//Description: This function is used to create or update a category in the database.
//Permission Level: Admin
//Parameters:
// -category: Category object containing the details of the category to be upserted
// Returns: Updated or newly created Category object.....

"use server";

import "server-only";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// Use an input type instead of Prisma's Category model (safer for client->server)
type UpsertCategoryInput = {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;

  createdAt: Date;
  updatedAt: Date;
};

export async function upsertCategory(category: UpsertCategoryInput) {
  // get the current user
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated user");

  const role = (
    user.privateMetadata?.role as string | undefined
  )?.toUpperCase();
  if (role !== "ADMIN") throw new Error("Unauthorized user");

  //if (!category) throw new Error("Category data is required");
  if (!category.name?.trim()) throw new Error("Category name is required");
  if (!category.url?.trim()) throw new Error("Category url is required");

  const existing = await db.category.findFirst({
    where: {
      AND: [
        { OR: [{ name: category.name }, { url: category.url }] },
        { NOT: { id: category.id ?? "" } },
      ],
    },
  });

  if (existing) {
    let errorMessage = "";
    if (existing.name === category.name) {
      errorMessage = "Category with the same name already exists";
    }
    if (existing.url === category.url) {
      errorMessage = "Category with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  return db.category.upsert({
    where: { id: category.id },
    update: {
      name: category.name,
      url: category.url,
      featured: category.featured,
      image: category.image,
    },
    create: {
      id: category.id,
      name: category.name,
      url: category.url,
      featured: category.featured,
      image: category.image,
    },
  });
}
