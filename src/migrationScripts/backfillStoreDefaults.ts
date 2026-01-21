"use server";

import { db } from "@/lib/db";

const backfillStoreDefaults = async () => {
  try {
    const stores = await db.store.findMany({
      where: {
        OR: [
          { returnPolicy: null },
          { defaultShippingService: null },
          { defaultShippingFeePerItem: null },
          { defaultShippingFeeAdditionalItem: null },
          { defaultShippingFeePerKg: null },
          { defaultShippingFeeFixed: null },
          { defaultDeliveryTimeMin: null },
          { defaultDeliveryTimeMax: null },
        ],
      },
    });
    console.log(`Found ${stores.length} stores to update.`);

    for (const store of stores) {
      await db.store.update({
        where: { id: store.id },
        data: {
          returnPolicy: store.returnPolicy ?? "30-day return policy",
          defaultShippingService:
            store.defaultShippingService ?? "International Delivery",
          defaultShippingFeePerItem: store.defaultShippingFeePerItem ?? 0,
          defaultShippingFeeAdditionalItem:
            store.defaultShippingFeeAdditionalItem ?? 0,
          defaultShippingFeePerKg: store.defaultShippingFeePerKg ?? 0,
          defaultShippingFeeFixed: store.defaultShippingFeeFixed ?? 0,
          defaultDeliveryTimeMin: store.defaultDeliveryTimeMin ?? 7,
          defaultDeliveryTimeMax: store.defaultDeliveryTimeMax ?? 31,
        },
      });
      console.log(`Updated store ${store.id}`);
    }
  } catch (error) {
    console.error("Failed to update variant images:", error);
    throw error;
  }
  //finally {
  //     await db.$disconnect();
  //   }
};

export default backfillStoreDefaults;
