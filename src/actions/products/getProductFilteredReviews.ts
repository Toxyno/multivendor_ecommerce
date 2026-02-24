//Function: getProductFilteredReviews
//Description: Retrieves Filtered and sorted reviews for a product from the database.
//Acccess Level: Public
//Parameters:
// --productId: The ID of the product for which to retrieve reviews.
// --filter: The filter criteria for reviews (e.g., "most_recent", "highest_rating", "lowest_rating").
// --sort: The sort order for reviews (e.g., "asc" for ascending, "desc" for descending).
// --page: The page number for pagination(1-based index).
// --pageSize: The number of reviews to return per page.
//Returns: A paginated list of reviews that match the specified filter and sort criteria.
"use server";

import "server-only";
import { db } from "@/lib/db";
import { SortOrder } from "@/lib/type";

const getProductFilteredReviews = async (
  productId: string,
  filter: { rating?: number; hasImages?: boolean },
  sort: { orderBy: "latest" | "oldest" | "highest" | "lowest" } | undefined,
  page: number = 1,
  pageSize: number = 10,
) => {
  try {
    const reviewFilter: any = {
      productId,
    };

    //Apply rating fiter if provided
    if (filter.rating) {
      reviewFilter.rating = { in: [filter.rating, filter.rating + 0.5] };
    }
    //Apply image filter if provided
    if (filter.hasImages) {
      reviewFilter.images = {
        some: {}, // This checks for the existence of at least one related image
      };
    }

    //set the sort order based on the provided sort criteria
    const sortOption: { createdAt?: SortOrder; rating?: SortOrder } =
      sort && sort.orderBy === "latest"
        ? { createdAt: "desc" }
        : sort && sort.orderBy === "oldest"
          ? { createdAt: "asc" }
          : sort && sort.orderBy === "highest"
            ? { rating: "desc" }
            : sort && sort.orderBy === "lowest"
              ? { rating: "desc" }
              : { createdAt: "desc" }; // Default sort by latest
    //calculate the pagination parameters
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    //fetch review from the datbase
    const reviews = await db.review.findMany({
      where: reviewFilter,
      orderBy: sortOption,
      include: {
        images: true,
        user: true,
      },
      skip, //skip record for pagination
      take, //take records for pagination
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching filtered reviews:", error);
    throw new Error("Failed to fetch filtered reviews");
  }
};

export default getProductFilteredReviews;
