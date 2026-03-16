import { getStoreDefaultShippingDetails } from "@/actions/stores/getStoreDefaultShippingDetails";
import getAllSubCategories from "@/actions/subcategories/getAllSubCategory";
import {
  Cart,
  CartItem,
  FreeShipping,
  FreeShippingCountry,
  Prisma,
  ProductVariantImage,
  ShippingAddress,
  ShippingFeeMethod,
  ShippingRate,
  Size,
  Country as CountryPrisma,
} from "@/generated/prisma/edge";
import countries from "@/data/countries.json";
import { getFilteredProducts } from "@/actions/products/getFilteredProducts";
import {
  getProductPageData,
  retrieveProductDetails,
} from "@/actions/products/getProductPageData";
import getShippingDetails from "@/actions/ShippingRate/getShippingDetails";
import getRatingStatistics from "@/actions/products/getRatingStatistics";.
import { Review,ReviewImage } from "@/generated/prisma/edge";
import { user } from "@/generated/prisma/edge";

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
  offerTagId?: string;
  //url: string;
  colors: { id?:string; color: string }[];
  sizes: {
    id?:string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: {
    id?:string;
    name: string;
    value: string;
  }[];
  variant_specs: {
    id?:string;
    name: string;
    value: string;
  }[];
  brand: string;
  sku: string;
  weight: number;
  isSale: boolean;
  saleEndDate?: string;
  keywords: string[];
  categoryId: string;
  subCategoryId: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: {id?:string; url: string }[];
  variantImage: { url: string } | null;
  questions: {
    id?:string;
    question: string;
    answer: string;
  }[];
  freeShippingForAllCountries: boolean;
  freeShippingCountriesId: { id?:string; label: string; value:string }[];
  shippingFeeMethod:ShippingFeeMethod
  createdAt: Date;
  updatedAt: Date;
};

export type CountryWithShippingRateType = {
  countryId: string;
  countryName: string;
  ShippingRate: ShippingRate;
};

export type Country = {
  ip: string;
  asn: string;
  as_name: string;
  as_domain: string;
  country_code: string;
  country: string;
  continent_code: string;
  continent: string;
};

export type SelectMenuOption = (typeof countries)[number];

//Get the Product type which is derived form the FilteredProduct
export type ProductType = Prisma.PromiseReturnType<
  typeof getFilteredProducts
>["products"][0];

export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImageType = {
  url: string;
  image: string;
};

export type ProductCardType = {
  id: string;
  name: string;
  slug: string;
};

//get the product page data type which is derived form the ProductDetails function
export type ProductPageType = Prisma.PromiseReturnType<
  typeof retrieveProductDetails
>;

export type ProductPageDataType = Prisma.PromiseReturnType<
  typeof getProductPageData
>;

export type ProductShippingDetailsType = Prisma.PromiseReturnType<
  typeof getShippingDetails
>;

export type RatingStatisticsType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>;

export type StatisticsCardType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>["ratingStatistics"];

export type FreeShippingTypeWithCountry = FreeShipping & {
  eligibleCountries: FreeShippingCountry[];
};

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  size: string;
  sizeId: string;
  quantity: number;
  price: number;
  stock: number; //total amount of product that is left
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  freeShipping: boolean;
};

export type ReviewWithImageType = Review & {
  images: ReviewImage[];
  user: user;
};

export type SortOrder =  "asc" | "desc";

export type ReviewFilteredType = {
  rating?: number;
  hasImages?: boolean;
};

export type ReviewOrderType = {
  orderBy: "latest" | "oldest" | "highest" | "lowest";
};

export type VariantInfoType = {
      variantName: string;
      variantImage: string | null;
      variantUrl: string;
      slug: string | null;
      images: ProductVariantImage[];
      sizes: Size[];
      colors: string[]| null;
}

export type ProductWithVariantsType = {
  variants:{
    id:string;
    variantName: string;
    variantImage: string | null;
    slug: string;
    sizes: Size[];
    colors: string;
    images: ProductVariantImage[];
  }[];
 }

 export type SimpleProductType ={
  name:string;
  slug:string;
  variantName:string;
  variantSlug:string;
  price:number;
  image:string;
 }

//  export type FeaturedCategoryType = Prisma.PromiseReturnType<
//  typeof getHomeFeaturedCategories
// >[0];

export type ReviewDetailsType={
  id: string;
  rating: number;
  review: string;
  images:{url:string}[];
  size: string;
  quantity: string;
  variant:string;
  color:string;
}

export type  CartWithCartItemsType =  Cart &{
  cartItems: CartItem[];}

  export type  UserShippingAddressType =  ShippingAddress &{
  country: CountryPrisma}

