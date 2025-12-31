//Function: getSubCategory
//Description: This function is used to fetch a single subcategory from the database based on the provided ID.
//Permission Level: Public
//Parameters: id (string) - The ID of the subcategory to fetch
// Returns: SubCategory object
"use server";

import "server-only";
import { db } from "@/lib/db";

const getSubCategory = async (subcategoryId: string) => {
  //ensure SubCategoryId is provided
  if (!subcategoryId) {
    throw new Error("SubCategory ID is required to fetch a subcategory.");
  }
  const subcategory = await db.subCategory.findUnique({
    where: { id: subcategoryId },
  });
  return subcategory;
};
export default getSubCategory;
