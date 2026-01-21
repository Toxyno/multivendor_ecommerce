//Function: updateStoreDefaultShippingDetails
//Descriptions: This function updates the default shipping details of a store by sending a POST request to the server with the provided shipping details.
//Parameters:
// -storeURL - The URL of the store to update shipping details for.
// - details: An object containing the store's default shipping details including storeUrl, defaultShippingService, defaultShippingFeeFixed, defaultShippingFeePerKg, and returnPolicy.
//Returns: A promise that resolves to the server's response in JSON format.

"use server";

import "server-only";
import { db } from "@/lib/db";
import { StoreDefaultShippingDetailsType } from "@/lib/type";
import { currentUser } from "@clerk/nextjs/server";

export async function updateStoreDefaultShippingDetails(
  storeURL: string,
  details: Partial<StoreDefaultShippingDetailsType>
) {
  try {
    //get the current user
    const user = await currentUser();

    //Ensure the user is authenticated
    if (!user) throw new Error("Unauthenticated user");

    //Verify the user has the seller role
    const role = (
      user.privateMetadata?.role as string | undefined
    )?.toUpperCase();
    if (role !== "SELLER") throw new Error("Unauthorized user");

    //ensure the store URL is provided
    if (!storeURL || !storeURL.trim()) throw new Error("Store URL is required");

    //ensure that the details object is provided
    if (!details) throw new Error("Shipping details are required");

    //make sure the seller is updating their own store

    const check_ownsership = await db.store.findUnique({
      where: { url: storeURL, ownerId: user.id },
    });

    if (!check_ownsership) throw new Error("You do not own this store");

    //find and update the store based on the storeurl

    const updatedStore = await db.store.update({
      where: { url: storeURL, ownerId: user.id },
      data: {
        defaultShippingService: details.defaultShippingService,
        defaultShippingFeeFixed: details.defaultShippingFeeFixed,
        defaultShippingFeePerKg: details.defaultShippingFeePerKg,
        defaultShippingFeeAdditionalItem:
          details.defaultShippingFeeAdditionalItem,
        defaultDeliveryTimeMin: details.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: details.defaultDeliveryTimeMax,
        defaultShippingFeePerItem: details.defaultShippingFeePerItem,
        returnPolicy: details.returnPolicy,
      },
    });
    return updatedStore;
  } catch (error) {
    console.error("Error updating store default shipping details:", error);
    throw error;
  }
}
