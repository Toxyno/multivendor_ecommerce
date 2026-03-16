//Function: getProductPageData
//Description: Retrieve details of a specific product variant from the database
//Acccess Level: Public
//Parameters:
// --productId: The slug of the product to which the variant belongs.
// --variantId: The slug of the specific product variant to retrieve.
//Returns:Details of the requested product variant or null if not found.

"use server";

import "server-only";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  ProductPageType,
  ProductShippingDetailsType,
  RatingStatisticsType,
} from "@/lib/type";
import getShippingDetails from "../ShippingRate/getShippingDetails";
import { currentUser } from "@clerk/nextjs/server";
import getRatingStatistics from "@/actions/products/getRatingStatistics";

export async function getProductPageData(
  productSlug: string,
  variantSlug: string,
) {
  //Get the current User
  const user = await currentUser();
  // Fetch the product variant data using productSlug and variantSlug from the database
  const productVariant = await retrieveProductDetails(productSlug, variantSlug);
  if (!productVariant) return;

  //get the users country
  const userCountry = await getUserCountry();

  //Calculate the shipping details based on user country and product variant
  const productShippingDetails = await getShippingDetails(
    productVariant.shippingFeeMethod || "",
    userCountry,
    productVariant.store,
    productVariant.freeShippings, // Assuming freeShippings is the correct property to pass as the fourth argument
  );

  //Fetch the followers count of the store

  const storeFollowersCount = await getStoreFollowersCount(
    productVariant.storeId ?? "",
  );

  const ratingStatistics = await getRatingStatistics(productVariant.id ?? "");

  //Check if the user is following the store
  const isUserFollowingStore = await checkIfUserFollowingStore(
    productVariant.storeId ?? "",
    user?.id ?? "", // Pass the user ID here when available
  );

  console.log(`Testing the shipping details is `, productShippingDetails);

  return formatProductResponse(
    productVariant,
    productShippingDetails,
    storeFollowersCount,
    isUserFollowingStore,
    ratingStatistics,
  );
}

//Helper functions //creat this function in different place so that it can be used in type derivation
export const retrieveProductDetails = async (
  productSlug: string,
  variantSlug: string,
) => {
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      store: true,
      specs: true,
      questions: true,
      reviews: {
        include: {
          images: true,
          user: true,
        },
        take: 10,
      },
      freeShippings: {
        include: {
          eligibleCountries: true,
        },
      },
      variants: {
        where: {
          slug: variantSlug,
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
          specs: true,
        },
      },
    },
  });

  //Get the Variant information from the product details
  // const variantImages = await db.productVariant.findMany({
  //   where: {
  //     productId: product?.id,
  //   },
  //   select: {
  //     variantImage: true,
  //     slug: true,
  //     images: true,
  //   },
  // });

  //Get the Variant information from the product details
  const variantInfo = await db.productVariant.findMany({
    where: {
      productId: product?.id,
    },
    include: {
      images: true,
      sizes: true,
      colors: true,
      product: {
        select: { slug: true },
      },
    },
  });

  return {
    ...product,
    variantInfo: variantInfo.map((variant) => ({
      variantName: variant.variantName,
      variantImage: variant.variantImage,
      variantUrl: `/product/${productSlug}/${variant.slug}`,
      slug: variant.slug,
      images: variant.images,
      sizes: variant.sizes,
      colors: variant.colors.map((color) => color.name).join(","),
    })),
  };
};

const getUserCountry = async () => {
  // Placeholder function to get user's country
  const getUserCountryCookie = await getCookie("userCountry", { cookies });
  const defaultCountry = { name: "United State", code: "US" };

  try {
    const parsedCountry = JSON.parse(getUserCountryCookie as string);
    console.log("Parsed Country:", parsedCountry);
    if (
      parsedCountry?.country &&
      parsedCountry.country_code &&
      typeof parsedCountry === "object"
    ) {
      return parsedCountry;
    }
    return defaultCountry;
  } catch (error) {
    console.error("Error parsing user country cookie:", error);
  }
};

const formatProductResponse = (
  product: ProductPageType,
  shippingDetails: ProductShippingDetailsType,
  followersCount: number,
  isUserFollowingStore: boolean,
  ratingStatistics: RatingStatisticsType,
) => {
  if (!product) return;
  const variant = product.variants?.[0];
  if (!variant) return null;
  const { store, category, subCategory, offerTag, questions } = product;
  const { images, colors, sizes } = variant;

  return {
    productId: product.id,
    variantId: variant.id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    variantImage: variant.variantImage,
    images,
    category,
    subCategory,
    offerTag,
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    weight: variant.weight,
    store: {
      storeId: store?.id ?? null,
      url: store?.url ?? null,
      name: store?.name ?? null,
      logo: store?.logo ?? null,
      followersCount: followersCount,
      isUserFollowingStore: isUserFollowingStore,
    },
    colors,
    sizes,
    specs: {
      product_specs: product.specs,
      variant_specs: variant.specs,
    },

    questions,
    rating: product.rating,
    reviews: product.reviews,
    //number_of_reviews: 122,
    // reviewsStatistics: {
    //   ratingStatistics: [],
    //   reviewWithImagesCount: 5,
    // },
    reviewsStatistics: ratingStatistics,
    shippingDetails: shippingDetails,
    relatedProduct: [],
    variantInfo: product.variantInfo,
  };
};

const getStoreFollowersCount = async (storeId: string) => {
  //TODO: Implement logic to count followers of the store using the database
  const storeFollowersCount = await db.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  return storeFollowersCount?._count.followers || 0;
};

const checkIfUserFollowingStore = async (storeId: string, userId: string) => {
  let isUserFollowingStore = false;
  if (userId) {
    const storeFollowersInfo = await db.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        followers: {
          where: {
            Id: userId,
          },
          select: {
            Id: true,
          },
        },
      },
    });
    if (storeFollowersInfo && storeFollowersInfo?.followers?.length > 0) {
      isUserFollowingStore = true;
    }
  }
  return isUserFollowingStore;
};
