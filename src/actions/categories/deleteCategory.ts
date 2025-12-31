//Function: deleteCategory
//Description: This function is used to delete a category from the database.
//Permission Level: Admin
//Parameters: id (string) - The ID of the category to delete
// Returns: The deleted Category object
"use server";

import "server-only";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const deleteCategory = async (categoryid: string) => {
  //Get the current user
  const user = await currentUser();

  console.log("publicMetadata:", user?.publicMetadata);
  console.log("privateMetadata:", user?.privateMetadata);

  //ensure categoryId is provided
  if (!categoryid) {
    throw new Error("Category ID is required to delete a category.");
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
  const deletedCategory = await db.category.delete({
    where: { id: categoryid },
  });
  return deletedCategory;
};
export default deleteCategory;
