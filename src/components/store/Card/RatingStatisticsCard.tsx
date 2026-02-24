"use client";
import { StatisticsCardType } from "@/lib/type";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StatisticsCardProps {
  statistics: StatisticsCardType;
}

const RatingStatisticsCard = ({ statistics }: StatisticsCardProps) => {
  return (
    <div className="h-44 flex-1">
      <div className="py-5 px-7 bg-[#f5f5f5] flex flex-col gap-2 h-full justify-center overflow-hidden rounded-lg">
        {statistics
          .slice()
          .reverse()
          .map((stat) => (
            <div key={stat.rating} className="flex items-center h-4">
              <ReactStars
                count={5}
                value={stat.rating}
                size={15}
                edit={false}
                isHalf
                color="#EAEAEA" // light gray
                emptyIcon={<FaRegStar />}
                halfIcon={<FaStarHalfAlt />}
                filledIcon={<FaStar />}
              />
              <div className="relative w-full flex-1 h-1.5 mx-2.5 bg-[#EAEAEA] rounded-full">
                <div
                  className="absolute left-0 h-full rounded-full bg-[#ffc50A]"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
              <div className="text-xs w-12 leading-4">{stat.numReview}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RatingStatisticsCard;
