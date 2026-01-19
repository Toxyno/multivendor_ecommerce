//Function: getOfferTagById
//Description: Fetches a single offer tag by its ID from the database.
//Access Level: Public
//Parameters:
//  - offerTagId: string - The ID of the offer tag to retrieve.
//Returns: An offer tag object if found, otherwise null.
"use server";

import { db } from "@/lib/db";

const getOfferTagById = async (offerTagId: string) => {
  //ensure that the Id is provided
  if (!offerTagId) {
    throw new Error("Invalid input: Offer tag ID is required");
  }
  const offerTag = await db.offerTag.findUnique({
    where: { id: offerTagId },
  });

  return offerTag;
};

export default getOfferTagById;
