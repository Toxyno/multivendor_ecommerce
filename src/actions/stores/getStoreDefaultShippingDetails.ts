//Function: getStoreDefaultShippingDetails
//Description: returns the default shipping details
//Parameters:
//  -storeUrl: The URL of the store to fetch the dafault shipping details for.
//Returns: An object containing the default shipping details for the specified store.
"use server";

import "server-only";
import { db } from "@/lib/db";

export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  try {
    //check if the stireUrl is not emptyu
    if (!storeUrl) {
      throw new Error("Store URL is required");
    }
    const store = await db.store.findUnique({
      where: { url: storeUrl },
      select: {
        defaultShippingService: true,
        defaultShippingFeePerItem: true,
        defaultShippingFeeAdditionalItem: true,
        defaultShippingFeePerKg: true,
        defaultShippingFeeFixed: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
        returnPolicy: true,
      },
    });
    //if there is not store, also return an error
    if (!store) {
      throw new Error("Store not found");
    }
    return store;
  } catch (error) {
    console.error("Error fetching store default shipping details:", error);
    throw new Error("Could not fetch store default shipping details");
  }
};
