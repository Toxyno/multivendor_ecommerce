//Function: getAllSubCategory
//Description: This function is used to fetch all subcategories from the database.
//Permission Level: Public
//Parameters: None
// Returns: Array of SubCategory objects
"use server";

import "server-only";
import { db } from "@/lib/db";

const getAllSubCategories = async () => {
  const subcategories = await db.subCategory.findMany({
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subcategories;
};

export default getAllSubCategories;
