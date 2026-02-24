"use client";
import { ProductVariantImage } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import ImageZoom from "react-image-zooom";

interface ProductSwiperProps {
  images: ProductVariantImage[];
  activeImage: ProductVariantImage | null;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}
const ProductSwiper = ({
  images,
  activeImage,
  setActiveImage,
}: ProductSwiperProps) => {
  if (!images) return;

  //useSte hook to manage the ative image being displayed, initialize the first image

  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2">
        {/* Thumbnails */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((image) => (
            <div
              key={image.imageUrl}
              className={cn(
                "w-15=6 h-16 rounded-md grid place-items.center overflow-hidden border border-gray-100 cursor-pointer duration-75 ease-in",
                {
                  "border-black": activeImage
                    ? activeImage.id === image.id
                    : false,
                },
              )}
              onMouseEnter={() => setActiveImage(image)}
            >
              <Image
                src={image.imageUrl}
                alt=""
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Image View */}
        <div className="relative rounded-lg overflow-hidden w-full 2xl:h-150 2xl:w-150">
          {activeImage && (
            <ImageZoom
              src={activeImage.imageUrl}
              zoom={300}
              className="w-full rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSwiper;
