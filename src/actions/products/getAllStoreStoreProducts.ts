//Function: getAllStoreStoreProducts
//Description: This action fetches all products associated with a specific store based on the provided storeUrl.
//It retrieves a list of products including their main details from the database.
//Access Level: Public
//Parameters:
//- storeUrl: string - The unique URL identifier of the store whose products are to be fetched.
//Returns: An array of product objects associated with the specified store. including the category,subcategory and variant details.

import { db } from "@/lib/db";

export const getAllStoreProducts = async (storeUrl: string) => {
  //retrieve the store detail
  const store = await db.store.findUnique({
    where: { url: storeUrl },
  });
  if (!store) {
    throw new Error("Store not found: Please provide a valid store");
  }

  //retrieve all products for the given store from database
  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      variants: {
        include: {
          images: true,
          sizes: true,
          colors: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });
  return products;
};
