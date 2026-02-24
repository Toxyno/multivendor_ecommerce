"use client";
import { ReviewWithImageType } from "@/lib/type";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ColorWheel from "@/components/shared/ColorWheel";
import { censorName } from "@/lib/utils";

interface ReviewCardProps {
  review: ReviewWithImageType;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const colors = review.color
    .split(",")
    .filter((color) => color.trim() !== "")
    .map((color) => ({ name: color.trim() }));

  const censoreName = censorName(review.user.name, review.user.name);

  return (
    <div className="border border-[#d8d8d8] rounded-xl flex h-fit relative py-2 px-2.5">
      <div className="w-16 px-1 space-y-1">
        <Image
          src={review.user.picture}
          alt={"Profile Image"}
          width={100}
          height={100}
          className="w-11 h-11 rounded-full object-cover"
        />
        <span className="text-xs text-gray-400">{censoreName.fullName}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between leading-5 overflow-hidden px-1.5">
        <div className="space-y-2">
          <ReactStars
            count={5}
            value={review.rating}
            size={15}
            edit={false}
            isHalf
            color="#EAEAEA" // light gray
            emptyIcon={<FaRegStar />}
            halfIcon={<FaStarHalfAlt />}
            filledIcon={<FaStar />}
          />
          <div className="flex items-center gap-x-2">
            <ColorWheel colors={colors} size={24} />
            <div className="text-sm text-gray-400">{review.variant}</div>
            <span></span>
            <div className="text-sm text-gray-400">{review.size}</div>
            <span></span>
            <div className="text-sm text-gray-400">{review.quantity}</div>
          </div>
          <p className="text-sm">{review.review}</p>
          {review.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.images.map((image) => (
                <div
                  key={image.id}
                  className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={image.url}
                    alt={`Review Image ${image.id}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
