"use client";
import { CartProductType, ProductPageDataType } from "@/lib/type";
import Link from "next/link";
import Image from "next/image";
import { CopyIcon } from "@/components/store/icons";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ProductPrice from "@/components/store/productPage/ProductInfo/ProductPrice";
import Countdown from "../../shared/Countdown";
import { Separator } from "@/components/ui/separator";
import ColorWheel from "@/components/shared/ColorWheel";
import ProductVariantSelector from "./ProductVariantSelector";
import SizeSelector from "./SizeSelector";
import ProductAssurancePolicy from "./ProductAssurancePolicy";
import { Dispatch, SetStateAction } from "react";
import { ProductVariantImage } from "@/generated/prisma";

interface ProductInfoProps {
  productData: ProductPageDataType;
  quantity: number;
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
  setTemporaryVariantImages: Dispatch<SetStateAction<ProductVariantImage[]>>;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}

const ProductInfo = ({
  productData,
  quantity,
  sizeId,
  handleChange,
  setTemporaryVariantImages,
  setActiveImage,
}: ProductInfoProps) => {
  //check if the productData exists, return null if its missing
  if (!productData) return null;

  //Destructure neccessary properties from the productData object
  const {
    productId,
    name,
    sku,
    colors,
    variantInfo,
    sizes,
    isSale,
    saleEndDate,
    variantName,
    store,
    rating,
    reviewsStatistics,
  } = productData;

  const { totalReviews } = reviewsStatistics;

  // Function to copy SKU to clipboard and show success or error toast
  const copySKUToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku).then(() => {
        toast.success("SKU copied to clipboard!");
      });
    } catch {
      toast.error("Failed to copy SKU.");
    }
  };

  return (
    <div className="relative w-full xl:w-[540px]">
      {/* Title */}
      <div>
        <h1 className="text-black inline font-bold leading-5">
          {name}. {variantName}
        </h1>
      </div>
      {/* SKU - Rating - Nummber of Reviews */}.
      <div className="flex items-center text-xs mt-2">
        {/* store details */}
        <Link
          href={`/store/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              width={109}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </Link>
        {/* SKU- Rating -Num of Reviews */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-[#2F68A8] mx-1 cursor-pointer"
            onClick={copySKUToClipboard}
          >
            <CopyIcon />
          </span>
        </div>
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap ">
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
          <Link href="#reviews" className="text-yellow-700 hover:underline">
            (
            {totalReviews === 0
              ? "No review yet"
              : totalReviews === 1
                ? "1 review"
                : `${totalReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      {/* Price and Countdown */}
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice
          sizeId={sizeId}
          sizes={sizes}
          handleChange={handleChange}
        />
        {isSale && saleEndDate && (
          <div className="mt-4 pb-2">
            <Countdown targetDate={saleEndDate} />
          </div>
        )}
      </div>
      <Separator className="mt-4" />
      {/* Color Wheel and Variant Selector */}
      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between text-black font-bold">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={25} />
          </span>
        </div>
        <div className="mt-4">
          {variantInfo.length > 1 && (
            <ProductVariantSelector
              variants={variantInfo}
              slug={productData.variantSlug}
              setTemporaryVariantImages={setTemporaryVariantImages}
              setActiveImage={setActiveImage}
            />
          )}
        </div>
      </div>
      {/* Size Selector */}
      <div className="mt-4 space-y-2">
        <div>
          <h1 className="text-black font-bold">Size</h1>
        </div>
        <SizeSelector
          sizes={sizes}
          sizeId={sizeId}
          handleChange={handleChange}
        />
      </div>
      {/* product Assurance */}
      <Separator className="my-2" />
      <ProductAssurancePolicy />
    </div>
  );
};

export default ProductInfo;
