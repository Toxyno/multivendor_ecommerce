//Functions: upsertShippingAddress
//Description: This function is responsible for either creating a new shipping address or updating an existing one based on the presence of an ID in the provided data. It sends a POST request to the server with the shipping address details and handles the response accordingly.
//Permission Level: Authenticated Users
//Parameters: An object containing the shipping address details, including an optional ID for updating an existing address.
//Returns: The newly created or updated shipping address object if the operation is successful, or an error message if it fails.

"use server";

import { ShippingAddress } from "@/generated/prisma";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const upsertShippingaddress = async (address: ShippingAddress) => {
  try {
    //Get the current user from the database
    const user = await currentUser();
    if (!user) {
      throw new Error("User must be authenticated to upsert shipping address");
    }

    //confirm the address data is provided
    if (!address) {
      throw new Error("Address data must be provided");
    }

    // HAndle making the rest of addresses dafault false when adding new default address
    if (address.defaultAddress) {
      const addressDb = await db.shippingAddress.findUnique({
        where: { id: address.id },
      });
      if (addressDb) {
        try {
          await db.shippingAddress.updateMany({
            where: {
              userId: user.id,
              defaultAddress: true,
            },
            data: {
              defaultAddress: false,
            },
          });
        } catch (error) {
          console.error("Error updating existing default address:", error);
          throw new Error("Failed to update existing default address");
        }
      }
    }

    //upsert the shipping address into the database
    const upsertedAddress = await db.shippingAddress.upsert({
      where: {
        id: address.id ?? "",
      },
      update: {
        ...address,
        userId: user.id,
      },
      create: {
        ...address,
        userId: user.id,
      },
    });

    return upsertedAddress;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upsert shipping address");
  }
};

export default upsertShippingaddress;
