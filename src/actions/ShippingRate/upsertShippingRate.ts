//Function: upsertShippingRate
//Description: Creates or updates a shipping rate for a specific country in a store.
//Permissions Level: Seller
//Parameters:
// --storeUrl: URL of the store where the shipping rate is to be upserted.
//  --shippingRate: The shipping rate object containing all necessary details.
//Returns: The created or updated shipping rate object.

// "use server";
// import { db } from "@/lib/db";
// import { CountryWithShippingRateType } from "@/lib/type";
// import { currentUser } from "@clerk/nextjs/server";

// export const upsertShippingRate = async (
//   storeUrl: string,
//   shippingRate: CountryWithShippingRateType
// ) => {
//   try {
//     // 1️⃣ Auth
//     const user = await currentUser();
//     if (!user) throw new Error("Unauthorized");

//     if (user.privateMetadata.role !== "SELLER") {
//       throw new Error("Unauthorized - Seller permissions required");
//     }
//     if (!storeUrl) {
//       throw new Error("Store URL is required");
//     }
//     // 2️⃣ Get store + ownership check in ONE query
//     const store = await db.store.findFirst({
//       where: {
//         url: storeUrl,
//         ownerId: user.id,
//       },
//       select: { id: true },
//     });
//     if (!store) {
//       throw new Error("Unauthorized - You do not own this store");
//     }

//     //check that the shipping rate is there
//     if (!shippingRate) {
//       throw new Error("Shipping rate data is required");
//     }

//     //ensure that the country Id is also there
//     if (!shippingRate.countryId) {
//       throw new Error("Country ID is required in shipping rate data");
//     }

//     // 3️⃣ Upsert shipping rate
//     // ShippingRate is an object (not an array), so don't index with [0]; perform update when id exists, otherwise create.
//     const sr = shippingRate.ShippingRate;
//     const data = {
//       countryId: shippingRate.countryId,
//       storeId: store.id,
//       shippingFeePerKg: sr?.shippingFeePerKg ?? 0,
//       shippingFeeFixed: sr?.shippingFeeFixed ?? 0,
//       deliveryTimeMin: sr?.deliveryTimeMin ?? 0,
//       deliveryTimeMax: sr?.deliveryTimeMax ?? 0,
//       returnPolicy: sr?.returnPolicy ?? "",
//       shippingService: sr?.shippingService ?? "",
//       shippingFeePerItem: sr?.shippingFeePerItem ?? 0,
//       shippingFeeAdditionalItem: sr?.shippingFeeAdditionalItem ?? 0,
//       // add other ShippingRate fields here if needed
//     };

//     let upsertedShippingRate;
//     if (sr?.id) {
//       upsertedShippingRate = await db.shippingRate.update({
//         where: { id: sr.id },
//         data,
//       });
//     } else {
//       upsertedShippingRate = await db.shippingRate.create({
//         data,
//       });
//     }

//     return upsertedShippingRate;
//   } catch (error) {
//     throw error;
//   }
// };

"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { CountryWithShippingRateType } from "@/lib/type";

export const upsertShippingRate = async (
  storeUrl: string,
  shippingRate: CountryWithShippingRateType
) => {
  // 1) Auth
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.privateMetadata.role !== "SELLER") {
    throw new Error("Unauthorized - Seller permissions required");
  }
  if (!storeUrl) throw new Error("Store URL is required");
  if (!shippingRate?.countryId) throw new Error("Country ID is required");

  // 2) store ownership
  const store = await db.store.findFirst({
    where: { url: storeUrl, ownerId: user.id },
    select: { id: true },
  });
  if (!store) throw new Error("Unauthorized - You do not own this store");

  const sr = shippingRate.ShippingRate;

  const data = {
    shippingFeePerKg: sr?.shippingFeePerKg ?? 0,
    shippingFeeFixed: sr?.shippingFeeFixed ?? 0,
    deliveryTimeMin: sr?.deliveryTimeMin ?? 0,
    deliveryTimeMax: sr?.deliveryTimeMax ?? 0,
    returnPolicy: sr?.returnPolicy ?? "",
    shippingService: sr?.shippingService ?? "",
    shippingFeePerItem: sr?.shippingFeePerItem ?? 0,
    shippingFeeAdditionalItem: sr?.shippingFeeAdditionalItem ?? 0,
  };

  // 3) upsert by (storeId, countryId)
  return db.shippingRate.upsert({
    where: {
      storeId_countryId: {
        storeId: store.id,
        countryId: shippingRate.countryId,
      },
    },
    update: data,
    create: {
      storeId: store.id,
      countryId: shippingRate.countryId,
      ...data,
    },
  });
};
