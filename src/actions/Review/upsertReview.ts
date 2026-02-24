"use server";
//Function: upsertReview
//Description: Create or update a product review based on the presence of an existing review by the user for the specified product variant.
//Access Level: Private (requires authentication)
//Parameters:
// --productId: The ID of the product for which the review is being created or updated.
// --review: Review Object containing details of the review to be upserted
//Returns: The created or updated review object.

import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

import { ReviewDetailsType } from "@/lib/type";

const upsertReview = async (productId: string, review: ReviewDetailsType) => {
  try {
    const user = await currentUser();
    //Ensure the iser is authenticated before allowing them to create or update a review
    if (!user) {
      throw new Error("You must be logged in to submit a review.");
    }
    //ensure that the projectId is valid and the review data is provided
    if (!productId) {
      throw new Error("Product ID is required.");
    }
    if (!review) {
      throw new Error("Review details are required.");
    }

    // check for existing review
    const existingReview = await db.review.findFirst({
      where: {
        productId,
        userId: user.id,
        variant: review.variant,
      },
    });

    let review_data: ReviewDetailsType = review;
    if (existingReview) {
      review_data = { ...review_data, id: existingReview.id };
    }

    //Upsert the review in to the datbase
    const reviewDetails = await db.review.upsert({
      where: {
        id: review_data.id,
      },
      update: {
        ...review_data,
        images: {
          deleteMany: {}, //Delete existing images before adding new ones
          create: review_data.images.map((image) => ({
            url: image.url,
          })),
        },
        userId: user.id,
      },
      create: {
        ...review_data,
        images: {
          create: review_data.images.map((image) => ({
            url: image.url,
          })),
        },
        productId,
        userId: user.id,
      },
      include: {
        images: true,
        user: true,
      },
    });

    //calculate the new average rating and total reviews count for the product after the review has been upserted
    const productReviews = await db.review.findMany({
      where: {
        productId,
      },
      select: {
        rating: true,
      },
    });

    const totalRating = productReviews.reduce(
      (acc, review) => acc + review.rating,
      0,
    );
    const averageRating = totalRating / productReviews.length;
    //Update the product with the new average rating and total reviews count
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        rating: averageRating,
        numReviews: productReviews.length,
      },
    });
    return reviewDetails;
  } catch (error) {
    console.log(error);
  }
};

export default upsertReview;
