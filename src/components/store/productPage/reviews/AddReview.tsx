"use client";

import { ReviewWithImageType, VariantInfoType } from "@/lib/type";
import { Dispatch, SetStateAction, useState } from "react";
import ReviewDetails from "@/components/store/Forms/ReviewDetails";

interface AddReviewProps {
  productId: string;
  reviews: ReviewWithImageType[];
  variantsInfo: VariantInfoType[];
  setReviews: Dispatch<SetStateAction<ReviewWithImageType[]>>;
}

const AddReview = ({
  productId,
  reviews,
  variantsInfo,
  setReviews,
}: AddReviewProps) => {
  const [reviewData, setReviewData] = useState<ReviewWithImageType[]>(reviews);
  return (
    <div>
      <ReviewDetails
        productId={productId}
        data={reviewData[0]}
        variantsInfo={variantsInfo}
        setReviews={setReviews}
      />
    </div>
  );
};

export default AddReview;
