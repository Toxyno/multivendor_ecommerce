//Function: getUserShippingAddresses
//Description:
//    -Fetches the list of shipping addresses associated with the current user.
//Permission Level: Authenticated Users
//Parameters: None
//Returns: An array of shipping addresses for the current user or an error message if the operation fails.

"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const getUserShippingAddresses = async () => {
  try {
    //Get the current user  from the database
    const user = await currentUser();
    if (!user) {
      throw new Error("User must be authenticated to get shipping addresses");
    }
    //Get all the shipping addresses for the specific User
    const shippingAddresses = await db.shippingAddress.findMany({
      where: {
        userId: user.id,
      },
      include: {
        country: true,
      },
    });
    return shippingAddresses;
  } catch (error) {
    console.error("Error fetching user shipping addresses:", error);
    throw new Error("Failed to fetch user shipping addresses");
  }
};

export default getUserShippingAddresses;
