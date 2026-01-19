//Funtion: upsertOfferTag
//Descriptions: This action upserts an offer tag based on the provided name and url. If an offer tag with the given name exists, it updates its url; otherwise, it creates a new offer tag with the specified name and url.
//Access Level: Admin Only
//Parameters:
//- name: string - The name of the offer tag.
//- url: string - The URL associated with the offer tag.
//Returns: The upserted offer tag object.
"use server";
import "server-only";
import { db } from "@/lib/db";

// import { OfferTags } from "@/types/OfferTags";
import { currentUser } from "@clerk/nextjs/server";

type OfferTagInput = {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

const upsertOfferTag = async (offerTag: OfferTagInput) => {
  console.log("Updating/Creating offer tag with data:", offerTag);
  try {
    //Get the current user information
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthorized: Please log in to perform this action");
    }
    //Ensure user has admin privileges
    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error(
        "Forbidden: You do not have permission to perform this action"
      );
    }

    //Ensure offer tag data is provided
    if (!offerTag || !offerTag.name || !offerTag.url) {
      throw new Error("Invalid input: Offer tag name and URL are required");
    }

    console.log("offerTag delegate:", (db as any).offerTag);
    console.log(
      "delegates:",
      Object.keys(db as any).filter((k) => !k.startsWith("$"))
    );

    //Upsert the offer tag in the database
    const existingOfferTag = await db.offerTag.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: offerTag.name }, { url: offerTag.url }],
          },
          {
            NOT: {
              id: offerTag.id ?? "",
            },
          },
        ],
      },
    });
    //throw error if offer tag with the same name or url exists
    if (existingOfferTag) {
      let errorMessage = "";
      if (existingOfferTag.name === offerTag.name) {
        errorMessage = "An offer tag with the same name already exists";
      }
      if (existingOfferTag.url === offerTag.url) {
        errorMessage = "An offer tag with the same URL already exists";
      }
      if (errorMessage) throw new Error(errorMessage);
    }

    //Proceed to upsert
    const offereTagDetails = await db.offerTag.upsert({
      where: { id: offerTag.id ?? "" },
      update: {
        name: offerTag.name,
        url: offerTag.url,
      },
      create: {
        name: offerTag.name,
        url: offerTag.url,
      },
    });
    return offereTagDetails;
  } catch (error) {
    //Log and rethrow the error for further handling
    console.error("Failed to upsert offer tag:", error);
    throw error;
  }
};

export default upsertOfferTag;
