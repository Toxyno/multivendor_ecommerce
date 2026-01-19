//Function: getAllSubCategoriesForCategory
//description: Fetches all sub-categories for a given category ID.
//Permission Level: Public
//Retruns: Array of sub-category objects.

"use server";

import "server-only";
import { db } from "@/lib/db";

const getAllSubCategoriesForCategory = async (categoryId: string) => {
  const subCategories = await db.subCategory.findMany({
    where: {
      categoryId: categoryId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

export default getAllSubCategoriesForCategory;
