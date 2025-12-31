//Function: getCategory
//Description: This function is used to fetch a single category from the database based on the provided ID.
//Permission Level: Public
//Parameters: id (string) - The ID of the category to fetch
// Returns: Category object

"use server";

import "server-only";
import { db } from "@/lib/db";

const getCategory = async (categoryId: string) => {
  //ensure CategoryId is provided
  if (!categoryId) {
    throw new Error("Category ID is required to fetch a category.");
  }
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });
  return category;
};
export default getCategory;
