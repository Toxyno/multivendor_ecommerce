import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VariantInfoType } from "@/lib/type";
import { ProductVariantImage } from "@/generated/prisma";
import { Dispatch, SetStateAction } from "react";

// interface ProductVariantProps {
//   // Define any props needed for the variant selector
//   url: string;
//   img: string;
//   slug: string;
// }

interface VariantProps {
  variants: VariantInfoType[];
  slug: string;
  setTemporaryVariantImages: Dispatch<SetStateAction<ProductVariantImage[]>>;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}

const ProductVariantSelector = ({
  variants,
  slug,
  setTemporaryVariantImages,
  setActiveImage,
}: VariantProps) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant) => {
        return (
          <Link
            key={variant.slug}
            href={variant.variantUrl}
            onMouseEnter={() => {
              // Update the temporary variant images when a variant is selected
              setTemporaryVariantImages(variant.images);
              //setActiveImage(variant.images[0]);
              //Set the active image to the first image of the selected variant
              if (variant.images.length > 0) {
                setActiveImage(variant.images[0]);
              }
            }}
            // Reset to default product images when mouse leaves the variant selector and the active image too should be change to the default product image
            onMouseLeave={() => {
              setTemporaryVariantImages([]);
              setActiveImage(null);
            }}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full grid place-items-center p-0.5 overflow-hidden hover:border-black border border-transparent cursor-pointer transition-all duration-75 ease-in",
                { "border-black": slug === variant.slug },
              )}
            >
              <Image
                src={variant.variantImage || ""}
                alt={`product variant ${variant.variantName}`}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductVariantSelector;
