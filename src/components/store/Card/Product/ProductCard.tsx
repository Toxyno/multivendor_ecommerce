"use client";
import { ProductType, VariantSimplified } from "@/lib/type";
import Link from "next/link";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ProductCardImageSwiper from "./ProductCardImageSwiper";
import VariantSwitcher from "./VariantSwitcher";
import { Button } from "@/components/store/ui/button";
import { Heart } from "lucide-react";
const ProductCard = ({ product }: { product: ProductType }) => {
  const { name, slug, rating, sales, variantImages, variants } = product;

  const [variant, setVariant] = useState<VariantSimplified>(variants[0]);

  const { variantSlug, variantName, images, sizes } = variant;

  console.log(
    "rating,sales:",
    product.rating,
    product.sales,
    typeof product.rating,
    typeof product.sales,
  );

  return (
    <div>
      <div className="group w-48 sm:w-56.25 relative transition-all duration-75 bg-whitye ease-in-out p-4 rounded-t-3xl border border-transparent hover:shadow-xl hover:border-border">
        <div className="relative w-full h-full">
          <Link
            href={`/product/${slug}/${variantSlug}`}
            className="w-full relative inline-block "
          >
            {/* Images Swiper */}
            {/* <img
              src={images[0]?.imageUrl}
              alt={variantName}
              className="w-full h-auto object-cover rounded-2xl"
            /> */}
            {/* {images[0]?.imageUrl ? (
              <Image
                src={images[0].imageUrl}
                alt={variantName}
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-2xl" />
            )} */}
            {/* Images Swiper */}
            <ProductCardImageSwiper images={images} />

            {/* Title */}
            <div className="text-sm text-black h-4.5 overflow-hidden overflow-ellipsis line-clamp-1">
              {name} . {variantName}
            </div>
            {/* Rating and Sales */}
            {
              /* You can add rating stars and sales info here */
              product.rating > 0 && product.sales > 0 && (
                <div className="flex items-center gap-x-1 ">
                  <ReactStars
                    count={5}
                    value={rating}
                    size={16}
                    edit={false}
                    isHalf
                    // activeColor="#FFD804"
                    // color="#F5F5F5"
                    activeColor="#FFA41C" // Amazon-like gold
                    color="#EAEAEA" // light gray
                    emptyIcon={<FaRegStar />}
                    halfIcon={<FaStarHalfAlt />}
                    filledIcon={<FaStar />}
                  />

                  <div className="text-xs text-main-secondary">
                    {sales} sold
                  </div>
                </div>
              )
            }
            {/* Price */}
          </Link>
        </div>
        <div className="hidden group-hover:block absolute -left-px bg-white border border-t-0 w-[calc(100%+2px)] px-4 pb-4 rounded-b-3xl shadow-xl z-30 space-y-2">
          {/* Variant Switcher */}
          <VariantSwitcher
            images={variantImages}
            variants={variants}
            setVariant={setVariant}
            selectedVariant={variant}
          />

          {/* Action Button  */}
          <div className="flex flex-items gap-x-1">
            <Button>Add to Cart</Button>
            <Button variant="black" size="icon">
              <Heart className="w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
