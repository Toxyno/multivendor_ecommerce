import { getStoreDefaultShippingDetails } from "@/actions/stores/getStoreDefaultShippingDetails";
import getAllSubCategories from "@/actions/subcategories/getAllSubCategory";
import { Prisma, ShippingRate } from "@/generated/prisma/edge";

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

//Store Default Shipping Details type
export type StoreDefaultShippingDetailsType = Prisma.PromiseReturnType<
  typeof getStoreDefaultShippingDetails
>;

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

export type CountryWithShippingRateType = {
  countryId: string;
  countryName: string;
  ShippingRate: ShippingRate;
};
