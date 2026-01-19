//Function: deleteOfferTag
//Description: Deletes a single offer tag by its ID from the database.
//Permission Level: Admin only
//Parameters:
//  - offerTagId: string - The ID of the offer tag to delete.
//Returns: A confirmation message upon successful deletion.

"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const deleteOfferTag = async (offerTagId: string) => {
  try {
    //get the current user information
    const user = await currentUser();

    //Ensure user is authenticated
    if (!user) {
      throw new Error("Unauthorized: Please log in to perform this action");
    }
    //Ensure user has admin privileges
    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error(
        "Forbidden: You do not have permission to perform this action"
      );
    }
    //Ensure offer tag ID is provided
    if (!offerTagId) {
      throw new Error("Invalid input: Offer tag ID is required");
    }
    //Delete the offer tag from the database
    const response = await db.offerTag.delete({
      where: { id: offerTagId },
    });
    return response;
  } catch (error) {
    //lo and rethrow error
    console.error("Error deleting offer tag:", error);
    throw error;
  }
};

export default deleteOfferTag;
