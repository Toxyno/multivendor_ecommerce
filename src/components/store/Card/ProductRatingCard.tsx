"use client";

import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface ProductRatingCardProps {
  rating: number;
}

const ProductRatingCard = ({ rating }: ProductRatingCardProps) => {
  const fixedRating = Number(rating.toFixed(2));
  return (
    <div className="h-44 flex-1">
      <div className="p-6 bg-[#f5f5f5] flex flex-col h-full justify-center overflow-hidden ">
        <div className="text-6xl font-bold">{rating}</div>
        <div className="py-1.5">
          <ReactStars
            count={5}
            value={rating}
            size={16}
            edit={false}
            isHalf
            activeColor="#FFA41C" // Amazon-like gold
            color="#EAEAEA" // light gray
            emptyIcon={<FaRegStar />}
            halfIcon={<FaStarHalfAlt />}
            filledIcon={<FaStar />}
          />
        </div>
        <div className="text-[#03c97a] leading-5 mt-2">
          All from verified purchases
        </div>
      </div>
    </div>
  );
};

export default ProductRatingCard;
