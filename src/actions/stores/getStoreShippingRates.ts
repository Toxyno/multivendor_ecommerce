//Function: getstoreShippingRates
//Description: Fetches shipping rates for a specific store based on provided parameters.
//Permissions Level: Public
//Parameters: No PArams
//Returns: Array of objects where each object contains a country and it associated shipping rates

"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const getStoreShippingRates = async (storeUrl: string) => {
  // 1️⃣ Auth
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  if (user.privateMetadata.role !== "SELLER") {
    throw new Error("Unauthorized - Seller permissions required");
  }

  if (!storeUrl) {
    throw new Error("Store URL is required");
  }

  // 2️⃣ Get store + ownership check in ONE query
  const store = await db.store.findFirst({
    where: {
      url: storeUrl,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!store) {
    throw new Error("Unauthorized - You do not own this store");
  }

  // 3️⃣ Fetch countries with store-specific shipping rates
  const countries = await db.country.findMany({
    orderBy: { name: "asc" },
    include: {
      shippingRates: {
        where: {
          storeId: store.id,
        },
      },
    },
  });

  // 4️⃣ Shape the response
  return countries.map((country) => ({
    countryId: country.id,
    countryName: country.name,
    shippingRates: country.shippingRates, // already filtered
  }));
};

export default getStoreShippingRates;

// const getStoreShippingRates = async (storeUrl: string) => {
//   try {
//     //get current user
//     const user = await currentUser();

//     //Ensure the user is authenticated
//     if (!user) {
//       throw new Error("Unauthorized");
//     }

//     //verify seller permissions
//     if (user.privateMetadata.role !== "SELLER") {
//       throw new Error("Unauthorized - Seller permissions required");
//     }

//     //ensure that the store URL is provided
//     if (!storeUrl) {
//       throw new Error("Store URL is required");
//     }

//     //Make sure the seller is updating therir own store
//     const check_ownership = await db.store.findUnique({
//       where: {
//         url: storeUrl,
//         ownerId: user.id,
//       },
//     });
//     if (!check_ownership) {
//       throw new Error("Unauthorized - You do not own this store");
//     }

//     //get the store details
//     const store = await db.store.findUnique({
//       where: {
//         url: storeUrl,
//         ownerId: user.id,
//       },
//     });

//     //retreve all countries
//     const countries = await db.country.findMany({
//       orderBy: { name: "asc" },
//     });

//     //get shipping rates for each country
//     // const shippingRates = [];
//     // for (const country of countries) {
//     //     const rates = await db.shippingRate.findMany({
//     //         where: {
//     //             storeId: store?.id,
//     //             countryId: country.id,
//     //         },
//     //         select: {
//     //             weightRange: true,
//     //             price: true,
//     //         },
//     //     });

//     //     shippingRates.push({
//     //         country: country.name,
//     //         rates: rates,
//     //     });
//     // }
//     // return shippingRates;

//     //retrieve all shipping rate for the specified store
//     const shippingRates = await db.shippingRate.findMany({
//       where: {
//         storeId: store?.id,
//       },
//     });

//     //create a map for a quick lookup of shipping rates by country Id
//     const countryRateMap = new Map();
//     shippingRates.forEach((rate) => {
//       countryRateMap.set(rate.countryId, []);
//     });

//     //Map Countries to their shipping rates
//     const result = countries.map((country) => ({
//       countryId: country.id,
//       countryName: country.name,
//       shippingRates: countryRateMap.get(country.id) || [],
//     }));

//     return result;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// export default getStoreShippingRates;
