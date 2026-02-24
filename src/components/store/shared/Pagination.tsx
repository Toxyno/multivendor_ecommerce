import { MoveLeft, MoveRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import cn from "classnames";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ currentPage, totalPages, setPage }: PaginationProps) => {
  function handlePrevious() {
    if (currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }

  function handleNext() {
    if (currentPage < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }

  return (
    <div className="w-full py-10 lg:px-0 sm:px-6 px-4">
      <div className="w-full flex items-center justify-end gap-x-4 border-t border-gray-200">
        <div
          className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          onClick={() => handlePrevious()}
        >
          <MoveLeft className="w-3" />
          <p className="ml-3 text-sm font-medium leading-none">Previous</p>
        </div>
        <div className="flex flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "text-sm font-medium leading-none px-4 py-2 rounded-md cursor-pointer",
                {
                  "border-indigo-400": i + 1 === currentPage,
                },
              )}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div
          className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          onClick={() => handleNext()}
        >
          <MoveRight className="w-3" />
          <p className="ml-3 text-sm font-medium leading-none">Next</p>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
