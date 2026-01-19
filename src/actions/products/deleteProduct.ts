//Function: deleteProduct
//Description: This action deletes a product from the database based on the provided productId.
//It ensures that the product is removed along with any associated data such as variants and images.
//Access Level: Seller  Only
//Parameters:
//- productId: string - The unique identifier of the product to be deleted.
//Returns: Response indicating success or failure of the deletion operation.
"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const deleteProduct = async (productId: string) => {
  //Get the current user information
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: Please log in to perform this action");
  }
  //Ensure user has seller privileges
  if (user.privateMetadata.role !== "SELLER") {
    throw new Error(
      "Forbidden: You do not have permission to perform this action"
    );
  }

  //Ensure product data is provider
  if (!productId) {
    throw new Error("Invalid request: Product ID is required");
  }

  // Delete the product from the database
  const response = await db.product.delete({
    where: { id: productId },
  });
  return response;
};
