//Function: followStore
//Description:
//    -Toggle follow status for a store by the current user.
//    -If the user is not following the store, it follows the store
//    -If the user is already following the store, it unfollows the store
//Permission Level: Authenticated Users
//Parameters:
//  -storeId: The ID of the store to be followed or unfollowed.
//Returns:  Returns true if the user is now following the store, false if the user has unfollowed the store, or an error message if the operation fails.

"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const followStore = async (storeId: string): Promise<boolean> => {
  try {
    //Get the current user
    const user = await currentUser();
    //ensure the the user is authenticated
    if (!user) {
      throw new Error("User must be authenticated to follow a store");
    }
    //check if the store exists
    const store = await db.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      throw new Error("Store not found");
    }
    //check if the user exists
    const userData = await db.user.findUnique({
      where: { Id: user.id },
    });
    if (!userData) {
      throw new Error("User not found");
    }
    //Check if the user is already following the store
    const isUserFollowingStore = await db.user.findFirst({
      where: {
        Id: user.id,
        following: {
          some: { id: storeId },
        },
      },
    });
    if (isUserFollowingStore) {
      // Unfollow the store
      await db.store.update({
        where: { id: storeId },
        data: {
          followers: {
            disconnect: { Id: userData.Id },
          },
        },
      });
      return false;
    } else {
      // Follow the store
      await db.store.update({
        where: { id: storeId },
        data: {
          followers: {
            connect: { Id: userData.Id },
          },
        },
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling follow status for store:", error);
    throw new Error("Failed to toggle follow status for store");
  }
};

export default followStore;
