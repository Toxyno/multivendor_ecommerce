import getAllSubCategories from "@/actions/subcategories/getAllSubCategory";
import { Prisma } from "@/generated/prisma/edge";

export interface DashBoardSideBarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// SubCategory + Parent category type
// This type represents a SubCategory along with its associated Category data.
// It is derived from the return type of the getAllSubCategories function.
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];
