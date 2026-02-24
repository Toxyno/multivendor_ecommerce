import { db } from "@/lib/db";

const getRatingStatistics = async (productId: string) => {
  const ratingstats = await db.review.groupBy({
    by: ["rating"],
    where: {
      productId: productId,
    },
    _count: {
      rating: true,
    },
  });
  const totalReviews = ratingstats.reduce(
    (acc, stat) => acc + stat._count.rating,
    0,
  );
  const ratingCount = new Array(5).fill(0);
  ratingstats.forEach((stat) => {
    const ratingValue = Math.floor(stat.rating);

    if (ratingValue >= 1 && ratingValue <= 5) {
      ratingCount[ratingValue - 1] = stat._count.rating;
    }
  });

  return {
    ratingStatistics: ratingCount.map((count, index) => ({
      rating: index + 1,
      numReview: count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    })),
    reviewWithImagesCount: await db.review.count({
      where: {
        productId: productId,
        images: {
          some: {},
        },
      },
    }),
    totalReviews: totalReviews,
  };
};

export default getRatingStatistics;
