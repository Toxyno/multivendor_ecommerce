//Function: getProductMainInfo
//Description: This action fetches the main information of a product based on the provided productId and storeUrl.
//It retrieves details such as product name, description, price, and availability from the database.
//Access Level: Public
//Parameters:
//- productId: string - The unique identifier of the product whose information is to be fetched.
//Returns: An object containing the main information of the specified product.

import { db } from "@/lib/db";

export const getProductMainInfo = async (productId: string) => {
  //retrieve product main info from database
  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }
  return {
    productId: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    subcategoryId: product.subCategoryId,
    storeId: product.storeId,
  };
};
