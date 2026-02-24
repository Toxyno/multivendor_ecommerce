import {
  ReviewFilteredType,
  RatingStatisticsType,
  ReviewOrderType,
} from "@/lib/type";
import { Dispatch, SetStateAction } from "react";
import cn from "classnames";

interface ProductReviewFilterProps {
  filters: ReviewFilteredType;
  setFilters: Dispatch<SetStateAction<ReviewFilteredType>>;
  stats: RatingStatisticsType;
  sort: ReviewOrderType | undefined;
  setSort: Dispatch<SetStateAction<ReviewOrderType | undefined>>;
}

const ProductReviewFilter = ({
  filters,
  setFilters,
  stats,
  sort,
  setSort,
}: ProductReviewFilterProps) => {
  const { rating, hasImages } = filters;
  const { totalReviews, ratingStatistics, reviewWithImagesCount } = stats;
  return (
    <div className="mt-8 relative overflow-hidden">
      <div className="flex flex-wrap gap-4">
        {/* All Reviews */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#ffebed] text-[#fd384f] border-[#fd384f]":
                !rating && !hasImages,
            },
          )}
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              rating: undefined,
              hasImages: undefined,
            }));
            setSort(undefined);
          }}
        >
          {" "}
          All{totalReviews ? ` (${totalReviews})` : ""}{" "}
        </div>
        {/* Include Picture */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#ffebed] text-[#fd384f] border-[#fd384f]": hasImages,
            },
          )}
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              hasImages: true,
            }));
          }}
        >
          {" "}
          Include Pictures({reviewWithImagesCount}){" "}
        </div>

        {/* Rating Filters */}
        {ratingStatistics.map((stat) => (
          <div
            key={stat.rating}
            className={cn(
              "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
              {
                "bg-[#ffebed] text-[#fd384f] border-[#fd384f]":
                  stat.rating === rating,
              },
            )}
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                rating: stat.rating,
              }));
            }}
          >
            {stat.rating} Stars ({stat.numReview}){" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviewFilter;
