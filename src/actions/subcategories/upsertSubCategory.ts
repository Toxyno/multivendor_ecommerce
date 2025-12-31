//Function: upsertSubCategory
//Description: This function is used to create or update a subcategory in the database.
//Permission Level: Admin
//Parameters:
// -SubCategory: SubCategory object containing the details of the subcategory to be upserted
// Returns: Updated or newly created SubCategory object.....

"use server";

import "server-only";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// Use an input type instead of Prisma's Category model (safer for client->server)
type UpsertSubCategoryInput = {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function upsertSubCategory(subCategory: UpsertSubCategoryInput) {
  // get the current user
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated user");

  const role = (
    user.privateMetadata?.role as string | undefined
  )?.toUpperCase();
  if (role !== "ADMIN") throw new Error("Unauthorized user");

  //if (!category) throw new Error("Category data is required");
  if (!subCategory.name?.trim())
    throw new Error("SubCategory name is required");
  if (!subCategory.url?.trim()) throw new Error("SubCategory url is required");

  const existing = await db.subCategory.findFirst({
    where: {
      AND: [
        { OR: [{ name: subCategory.name }, { url: subCategory.url }] },
        { NOT: { id: subCategory.id ?? "" } },
      ],
    },
  });

  if (existing) {
    let errorMessage = "";
    if (existing.name === subCategory.name) {
      errorMessage = "SubCategory with the same name already exists";
    }
    if (existing.url === subCategory.url) {
      errorMessage = "SubCategory with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  return db.subCategory.upsert({
    where: { id: subCategory.id },
    update: {
      name: subCategory.name,
      url: subCategory.url,
      featured: subCategory.featured,
      image: subCategory.image,
      categoryId: subCategory.categoryId,
    },
    create: {
      id: subCategory.id,
      name: subCategory.name,
      url: subCategory.url,
      featured: subCategory.featured,
      image: subCategory.image,
      categoryId: subCategory.categoryId,
    },
  });
}
