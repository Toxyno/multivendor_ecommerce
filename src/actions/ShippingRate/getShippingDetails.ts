//Function: getShippingDetails
//Description: Calculate shipping details based on shipping fee method, user country, and store location
//Acccess Level: Public
//Parameters:
// --shippingFeeMethod: The method used to calculate shipping fees.
// --userCountry: The country of the user for shipping calculation.
// --store: The store from which the product is being shipped.
//Returns:Shipping details including cost and estimated delivery time.

"use server";

import { Store } from "@/generated/prisma/edge";
import { db } from "@/lib/db";
import { FreeShippingTypeWithCountry } from "@/lib/type";

type UserCountry = { country: string; country_code: string };

type ShippingDetails = {
  shippingFeeMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  returnPolicy: string;
  countryCode: string;
  countryName: string;
  freeShipping: boolean;
};

function computePaidShipping(
  shippingFeeMethod: string,
  base: Omit<ShippingDetails, "shippingFee" | "extraShippingFee">,
  rates: {
    perItem: number;
    additionalItem: number;
    perKg: number;
    fixed: number;
  },
): ShippingDetails {
  const details: ShippingDetails = {
    ...base,
    shippingFee: 0,
    extraShippingFee: 0,
  };

  const { freeShipping } = details;

  switch (shippingFeeMethod) {
    case "ITEM":
      details.shippingFee = freeShipping ? 0 : rates.perItem;
      details.extraShippingFee = freeShipping ? 0 : rates.additionalItem;
      return details;
    case "WEIGHT":
      details.shippingFee = freeShipping ? 0 : rates.perKg;
      return details;
    case "FIXED":
      details.shippingFee = freeShipping ? 0 : rates.fixed;
      return details;
    default:
      return details;
  }
}

export default async function getShippingDetails(
  shippingFeeMethod: string,
  userCountry: UserCountry,
  store: Store,
  freeShipping: FreeShippingTypeWithCountry | null,
): Promise<ShippingDetails | null> {
  const country = await db.country.findUnique({
    where: {
      name: userCountry.country,
      code: userCountry.country_code,
    },
  });

  if (!country) return null;

  const shippingRate = await db.shippingRate.findFirst({
    where: {
      storeId: store.id,
      countryId: country.id,
    },
  });

  const returnPolicy = shippingRate?.returnPolicy ?? store.returnPolicy;
  const shippingService =
    shippingRate?.shippingService ?? store.defaultShippingService;

  const deliveryTimeMin =
    shippingRate?.deliveryTimeMin ?? store.defaultDeliveryTimeMin;
  const deliveryTimeMax =
    shippingRate?.deliveryTimeMax ?? store.defaultDeliveryTimeMax;

  const rates = {
    perItem:
      shippingRate?.shippingFeePerItem ?? store.defaultShippingFeePerItem,
    additionalItem:
      shippingRate?.shippingFeeAdditionalItem ??
      store.defaultShippingFeeAdditionalItem,
    perKg: shippingRate?.shippingFeePerKg ?? store.defaultShippingFeePerKg,
    fixed: shippingRate?.shippingFeeFixed ?? store.defaultShippingFeeFixed,
  };

  const base = {
    shippingFeeMethod,
    shippingService,
    deliveryTimeMin,
    deliveryTimeMax,
    returnPolicy,
    countryCode: userCountry.country_code,
    countryName: userCountry.country,
    freeShipping: false,
  } satisfies Omit<ShippingDetails, "shippingFee" | "extraShippingFee">;

  // Free shipping eligibility
  const eligibleCountries = freeShipping?.eligibleCountries ?? [];
  const isEligibleForFreeShipping = eligibleCountries.some(
    (eligible) => eligible.countryId === country.id,
  );

  console.log(
    `The eligible countries for free shipping are `,
    eligibleCountries,
  );

  if (freeShipping && isEligibleForFreeShipping) {
    return {
      ...base,
      shippingFee: 0,
      extraShippingFee: 0,
      freeShipping: true,
    };
  }

  // Not eligible (or no freeShipping configured) => paid shipping
  return computePaidShipping(shippingFeeMethod, base, rates);
}

// "use server";

// import { Store } from "@/generated/prisma/edge";
// import { db } from "@/lib/db";
// import { FreeShippingTypeWithCountry } from "@/lib/type";

// const getShippingDetails = async (
//   shippingFeeMethod: string,
//   userCountry: { country: string; country_code: string },
//   store: Store,
//   freeShipping: FreeShippingTypeWithCountry,
// ) => {
//   let shippingDetails = {
//     shippingFeeMethod,
//     shippingService: "",
//     shippingFee: 0,
//     extraShippingFee: 0,
//     deliveryTimeMin: 0,
//     deliveryTimeMax: 0,
//     returnPolicy: "",
//     countryCode: userCountry.country_code,
//     countryName: userCountry.country,
//     freeShipping: false,
//   };

//   const country = await db.country.findUnique({
//     where: {
//       name: userCountry.country,
//       code: userCountry.country_code,
//     },
//   });

//   if (country) {
//     const shippingRate = await db.shippingRate.findFirst({
//       where: {
//         storeId: store.id,
//         countryId: country.id,
//       },
//     });

//     const returnPolicy = shippingRate?.returnPolicy || store.returnPolicy;
//     const shippingService =
//       shippingRate?.shippingService || store.defaultShippingService;
//     const shippingFeePerItem =
//       shippingRate?.shippingFeePerItem || store.defaultShippingFeePerItem;
//     const shippingFeeAdditionalItem =
//       shippingRate?.shippingFeeAdditionalItem ||
//       store.defaultShippingFeeAdditionalItem;
//     const deliveryTimeMin =
//       shippingRate?.deliveryTimeMin || store.defaultDeliveryTimeMin;
//     const deliveryTimeMax =
//       shippingRate?.deliveryTimeMax || store.defaultDeliveryTimeMax;
//     const shippingFeePerKg =
//       shippingRate?.shippingFeePerKg || store.defaultShippingFeePerKg;
//     const shippingFeeFixed =
//       shippingRate?.shippingFeeFixed || store.defaultShippingFeeFixed;

//     console.log(`free shipping status is `, freeShipping);

//     //Check for free Shipping
//     if (freeShipping) {
//       console.log(
//         "Free shipping is available for this product. Checking eligibility...",
//       );
//       const free_shipping_countries = freeShipping.eligibleCountries;
//       console.log(
//         `Eligible countries for free shipping:`,
//         free_shipping_countries,
//       );
//       const isEligibleForFreeShipping = free_shipping_countries.find(
//         (country) => country.countryId === country.id,
//       );

//       if (isEligibleForFreeShipping) {
//         shippingDetails.freeShipping = true;
//       } else {
//         shippingDetails = {
//           shippingFeeMethod,
//           shippingService: shippingService,
//           shippingFee: 0,
//           extraShippingFee: 0,
//           deliveryTimeMin,
//           deliveryTimeMax,
//           returnPolicy,
//           countryCode: userCountry.country_code,
//           countryName: userCountry.country,
//           freeShipping: shippingDetails.freeShipping,
//         };

//         switch (shippingFeeMethod) {
//           case "ITEM":
//             shippingDetails.shippingFee = shippingFeePerItem;
//             shippingDetails.extraShippingFee = shippingFeeAdditionalItem;
//             break;
//           case "WEIGHT":
//             shippingDetails.shippingFee = shippingFeePerKg;
//             break;
//           case "FIXED":
//             shippingDetails.shippingFee = shippingFeeFixed;
//             break;
//           default:
//             shippingDetails.shippingFee = 0;
//         }
//         return shippingDetails;
//       }

//       return false;
//     }
//   }
// };
// export default getShippingDetails;

// /path/to/getShippingDetails.ts
