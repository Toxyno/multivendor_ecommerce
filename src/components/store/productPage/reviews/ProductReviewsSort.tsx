import { Dispatch, SetStateAction } from "react";
import { ReviewOrderType } from "@/lib/type";
import { ChevronDown } from "lucide-react";

interface ProductReviewsSortProps {
  sort: ReviewOrderType | undefined;
  setSort: Dispatch<SetStateAction<ReviewOrderType | undefined>>;
}

const ProductReviewsSort = ({ sort, setSort }: ProductReviewsSortProps) => {
  return (
    <div className="group w-[120px]">
      {/* Trigger */}
      <button className="text-black hover:text-[#fd384f] text-sm py-0.5 bg-yellow-50 text-center inline-flex items-center">
        Sort by {sort?.orderBy === "latest" ? "Latest" : "default"}
        <ChevronDown className="w-3 ml-1" />
        <div className="z-10 hidden absolute bg-white shadow w-[120px] group-hover:block">
          <ul className="text-sm text-gray-700">
            <li>
              <button
                onClick={() => setSort({ orderBy: "highest" })}
                className="block w-full text-left p-2 hover:bg-gray-100"
              >
                Sort by Highest
              </button>
            </li>
            <li>
              <button
                onClick={() => setSort({ orderBy: "latest" })}
                className="block w-full text-left p-2 hover:bg-gray-100"
              >
                Sort by latest
              </button>
            </li>
          </ul>
        </div>
      </button>
    </div>
  );
};

export default ProductReviewsSort;
