//Function: getSubCategoriesByParams
//Description: Retrieves subcategories from the database, with options for limiting the response
//Parameters:
// - limit: number (optional) - The maximum number of subcategories to retrieve
// - random: boolean (optional) -Indication whether to retrieve subcategories in random order
//Returnes: List of subcategories based on the provided options

import { SubCategory } from "@/types/SubCategory";
import { db } from "@/lib/db";

export const getSubCategoriesByParams = async (
  limit: number | null,
  random: boolean = false,
): Promise<SubCategory[]> => {
  //define SortOrder enum
  enum SortOrder {
    ASC = "asc",
    DESC = "desc",
  }

  try {
    //Define the query option
    const queryOptions = {
      take: limit || undefined, //Use the provided limit or undefined for no  limit
      orderBy: random ? { id: SortOrder.DESC } : undefined, //If random is true, order by id in descending order
    };
    if (random) {
      const subcategories = await db.$queryRaw<
        SubCategory[]
      >`SELECT * FROM SubCategory ORDER BY RAND() LIMIT ${limit || 10}`;
      return subcategories;
    } else {
      const subcategories = await db.subCategory.findMany(queryOptions);
      return subcategories;
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};
