import { VariantImageType, VariantSimplified } from "@/lib/type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { Dispatch } from "react";

interface Props {
  images: VariantImageType[];
  variants: VariantSimplified[];
  setVariant: Dispatch<React.SetStateAction<VariantSimplified>>;
  selectedVariant: VariantSimplified;
}

const VariantSwitcher = ({
  images,
  variants,
  setVariant,
  selectedVariant,
}: Props) => {
  return (
    <div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((image, index) => (
            <Link
              href="#"
              key={image.image || index}
              className={cn("p-0.5 rounded-full border-2 border-transparent", {
                "border-border": variants[index] === selectedVariant,
              })}
              onMouseEnter={() => setVariant(variants[index])}
            >
              <Image
                src={image.image}
                alt={`Variant ${index}`}
                width={100}
                height={100}
                className="w-8 h-8 object-cover rounded-full cursor-pointer"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantSwitcher;
