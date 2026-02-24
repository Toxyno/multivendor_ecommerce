"use client";
import {
  RatingStatisticsType,
  ReviewWithImageType,
  ReviewOrderType,
  ReviewFilteredType,
  VariantInfoType,
} from "@/lib/type";
import ProductRatingCard from "@/components/store/Card/ProductRatingCard";
import RatingStatisticsCard from "@/components/store/Card/RatingStatisticsCard";
import { useState, useEffect } from "react";
import ReviewCard from "@/components/store/Card/ReviewCard";
import getProductFilteredReviews from "@/actions/products/getProductFilteredReviews";
import ProductReviewFilter from "@/components/store/productPage/reviews/ProductReviewFilter";
import ProductReviewsSort from "@/components/store/productPage/reviews/ProductReviewsSort";
import Pagination from "@/components/store/shared/Pagination";
import ReviewDetails from "../../Forms/ReviewDetails";

interface ProductReviewsProps {
  productId: string;
  rating: number;
  statistics: RatingStatisticsType;
  reviews: ReviewWithImageType[];
  variantsInfo: VariantInfoType[];
}

const ProductReviews = ({
  productId,
  rating,
  statistics,
  reviews,
  variantsInfo,
}: ProductReviewsProps) => {
  //creating a state to hol the reviews
  const [data, setdata] = useState<ReviewWithImageType[]>(reviews);
  const { totalReviews, ratingStatistics } = statistics;
  const half = Math.ceil(data.length / 2);
  console.log(`The total reviews: ${totalReviews}`);

  //   Filtering
  const filtered_Data = {
    rating: undefined,
    hasImages: undefined,
  };
  const [filters, setFilters] = useState<ReviewFilteredType>(filtered_Data);

  //Sorting
  const [sort, setSort] = useState<ReviewOrderType>();

  //Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const handleGetReviews = async () => {
    const resp = await getProductFilteredReviews(
      productId,
      filters,
      sort,
      page,
      pageSize,
    );
    setdata(resp);
  };

  useEffect(() => {
    if (filters.rating || filters.hasImages || sort) {
      setPage(1); // Reset to the first page when filters or sort order change
      handleGetReviews();
    }
    if (page) {
      handleGetReviews();
    }
  }, [filters, sort, page, pageSize]);

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">
          Customer Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-center gap-4">
          {/* Rating Card */}
          <ProductRatingCard rating={rating} />
          {/* Rating Statistics card */}
          <RatingStatisticsCard statistics={ratingStatistics} />
        </div>
      </div>
      {totalReviews > 0 ? (
        <>
          <div className="spacey-6">
            {/* Review Filter */}
            <ProductReviewFilter
              filters={filters}
              setFilters={setFilters}
              stats={statistics}
              sort={sort}
              setSort={setSort}
            />
            {/* Review Sort */}
            <ProductReviewsSort sort={sort} setSort={setSort} />
          </div>

          {/* Reviews */}
          <div className="mt-6  grid grid-cols-2 gap-2">
            {data.length > 0 ? (
              <>
                <div className="flex flex-col gap-2">
                  {data.slice(0, half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {data.slice(half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <>No Reviews</>
            )}
          </div>

          {/* Pagination */}
          {data.length >= pageSize && (
            <Pagination
              currentPage={page}
              totalPages={
                filters.rating || filters.hasImages
                  ? Math.ceil(data.length / pageSize)
                  : Math.ceil(totalReviews / pageSize)
              }
              setPage={setPage}
            />
          )}
        </>
      ) : (
        <>No Reviews</>
      )}
      <div className="mt-10">
        <ReviewDetails
          productId={productId || ""}
          reviews={data}
          variantsInfo={variantsInfo}
          setReviews={setdata}
        />
      </div>
    </div>
  );
};

export default ProductReviews;
