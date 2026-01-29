//Funtion: getAllOfferTags
//Descriptions: This action retrieves all offer tags from the database.
//Access Level: Public
//Parameters: None
//Returns: An array of offer tag objects.
"use server";

import { db } from "@/lib/db";

const getAllOfferTags = async (storeUrl?: string) => {
  let storeId: string | undefined = undefined;
  if (storeUrl) {
    // get the storeId based on the storeUrl
    const store = await db.store.findUnique({
      where: { url: storeUrl },
      select: { id: true },
    });

    //if no store is found, return an empty array
    if (!store) {
      return [];
    }

    storeId = store.id;
  }

  const offerTags = await db.offerTag.findMany({
    where: storeId
      ? {
          products: {
            some: {
              storeId: storeId,
            },
          },
        }
      : {},
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      products: {
        _count: "desc", // Order by the count of associated products in descending order
      },
    },
  });

  return offerTags;
};

export default getAllOfferTags;
