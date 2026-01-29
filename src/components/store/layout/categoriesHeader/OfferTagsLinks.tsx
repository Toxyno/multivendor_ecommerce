import { cn } from "@/lib/utils";
import { OfferTags } from "@/types/OfferTags";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

const breakpoints = [
  { name: "isPhoneScvreen", query: "(max-width:640px)", value: 2 },
  { name: "isSmallScreen", query: "(max-width:640px)", value: 3 },
  { name: "isMediumScreen", query: "(max-width:768px)", value: 4 },
  { name: "isLargeScreen", query: "(max-width:1024px)", value: 5 },
  { name: "isExtraLargeScreen", query: "(max-width:1280px)", value: 6 },
  { name: "is2XLargeScreen", query: "(max-width:1536px)", value: 7 },
];

// custom hook that calls hooks at the top level (no loops/callbacks inside)
const useBreakPoints = () => {
  const isPhoneScvreen = useMediaQuery({ query: breakpoints[0].query });
  const isSmallScreen = useMediaQuery({ query: breakpoints[1].query });
  const isMediumScreen = useMediaQuery({ query: breakpoints[2].query });
  const isLargeScreen = useMediaQuery({ query: breakpoints[3].query });
  const isExtraLargeScreen = useMediaQuery({ query: breakpoints[4].query });
  const is2XLargeScreen = useMediaQuery({ query: breakpoints[5].query });

  return {
    isPhoneScvreen: isPhoneScvreen ? breakpoints[0].value : 0,
    isSmallScreen: isSmallScreen ? breakpoints[1].value : 0,
    isMediumScreen: isMediumScreen ? breakpoints[2].value : 0,
    isLargeScreen: isLargeScreen ? breakpoints[3].value : 0,
    isExtraLargeScreen: isExtraLargeScreen ? breakpoints[4].value : 0,
    is2XLargeScreen: is2XLargeScreen ? breakpoints[5].value : 0,
  };
};

const OfferTagsLinks = ({ offerTags }: { offerTags: OfferTags[] }) => {
  const breakPointValues = useBreakPoints();
  const visibleTagsCount = Object.values(breakPointValues).reduce(
    (a, b) => Math.max(a, b),
    0,
  );
  const displayedOfferTags = offerTags.slice(0, visibleTagsCount);

  return (
    <div className="relative w-fit ">
      <div className="flex items-center flex-wrap xl:translate-x-6 transition-all duration-100 ease-in-out">
        {displayedOfferTags.map((tag, i) => (
          <Link
            key={tag.id}
            href={`/browse?offer=${tag.url}`}
            className={cn(
              "font-bold text-white text-center px-4 leading-10 rounded-[20px] hover:bg-[#ffffff33] ",
              {
                "text-orange-background": i === 0,
              },
            )}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OfferTagsLinks;
