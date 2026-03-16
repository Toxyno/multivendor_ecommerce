//Function: getDeliveryDetailsForStoreByCountry
//Description:
//    -Fetches the delivery details for a specific store based on the country. This includes information such as estimated delivery time, shipping fees, and available shipping options.
//Permission Level: Authenticated Users
//Parameters: An object containing the store ID and country ID for which to fetch the delivery details.
//Returns: An object containing the delivery details for the specified store and country, or an error message if the operation fails.

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const getDeliveryDetailsForStoreByCountry = async (
  storeId: string,
  countryId: string,
) => {
  // Ensure that the user is authenticated
  const user = await currentUser();
  if (!user) {
    throw new Error("User must be authenticated to fetch delivery details");
  }

  // Fetch the store and country details from the database
  //   const store = await db.store.findUnique({
  //     where: {
  //       id: storeId,
  //     },
  //   });

  //get the shipping rate
  const shippingRate = await db.shippingRate.findFirst({
    where: {
      storeId: storeId,
      countryId: countryId,
    },
  });

  let storeDetails;

  if (!shippingRate) {
    storeDetails = await db.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        defaultShippingService: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
      },
    });
  }

  const shippingService = shippingRate
    ? shippingRate.shippingService
    : storeDetails?.defaultShippingService;

  const deliveryTimeMin = shippingRate
    ? shippingRate.deliveryTimeMin
    : storeDetails?.defaultDeliveryTimeMin;

  const deliveryTimeMax = shippingRate
    ? shippingRate.deliveryTimeMax
    : storeDetails?.defaultDeliveryTimeMax;

  return {
    shippingService,
    deliveryTimeMin,
    deliveryTimeMax,
  };
};

export default getDeliveryDetailsForStoreByCountry;
