//Function: getAllCategory
//Description: This function is used to fetch all categories from the database.
//Permission Level: Public
//Parameters: None
// Returns: Array of Category objects

"use server";

import "server-only";
import { db } from "@/lib/db";

const getAllCategory = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

export default getAllCategory;
