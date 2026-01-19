"use server";

import { db } from "@/lib/db";

const updateVariantImage = async () => {
  try {
    const variants = await db.productVariant.findMany({
      include: {
        images: true,
      },
    });
    for (const variant of variants) {
      if (variant.images.length > 0) {
        const firstImage = variant.images[0];
        await db.productVariant.update({
          where: { id: variant.id },
          data: { variantImage: firstImage.imageUrl },
        });
        console.log(
          `Updated variant ${variant.id} with image ${firstImage.imageUrl}`
        );
      }
    }
    console.log("Variant images update completed.");
  } catch (error) {
    console.error("Failed to update variant images:", error);
    throw error;
  }
  //finally {
  //     await db.$disconnect();
  //   }
};

export default updateVariantImage;
