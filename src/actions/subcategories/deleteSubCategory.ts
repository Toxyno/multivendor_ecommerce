//Function: deleteSubCategory
//Description: This function is used to delete a subcategory from the database.
//Permission Level: Admin
//Parameters: id (string) - The ID of the subcategory to delete
// Returns: The deleted SubCategory object
"use server";

import "server-only";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const deleteSubCategory = async (subcategoryId: string) => {
  //Get the current user
  const user = await currentUser();

  console.log("publicMetadata:", user?.publicMetadata);
  console.log("privateMetadata:", user?.privateMetadata);

  //ensure subCategoryId is provided
  if (!subcategoryId) {
    throw new Error("SubCategory ID is required to delete a subcategory.");
  }

  //check if the user is authenticated
  if (!user) {
    throw new Error("You must be logged in to perform this action.");
  }
  //Check if the user is an admin
  const role = user?.privateMetadata?.role;
  console.log(`Role ${role}`);
  if (!role || String(role).toLowerCase() !== "admin") {
    throw new Error("You do not have permission to perform this action.");
  }
  const deletedSubCategory = await db.subCategory.delete({
    where: { id: subcategoryId },
  });
  return deletedSubCategory;
};
export default deleteSubCategory;
