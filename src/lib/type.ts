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

//Product plus variants type

export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  //url: string;
  colors: { color: string }[];
  sizes: {
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: {
    name: string;
    value: string;
  }[];
  variant_specs: {
    name: string;
    value: string;
  }[];
  brand: string;
  sku: string;
  isSale: boolean;
  saleEndDate?: string;
  keywords: string[];
  categoryId: string;
  subCategoryId: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { url: string }[];
  variantImage: { url: string } | null;
  questions: {
    question: string;
    answer: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
