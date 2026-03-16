import { CartItem } from "@/generated/prisma";

import { ChevronRight } from "lucide-react";

import Image from "next/image";
import NextLink from "next/link";

interface CheckoutProductCardProps {
  // Define any props needed for the CheckoutProductCard component}}
  product: CartItem;
}

const CheckoutProductCard = ({ product }: CheckoutProductCardProps) => {
  const { productSlug, variantSlug, sizeId } = product;
  return (
    <div className="bg-white px-6 border-t border-t-[#ebebeb] select-none">
      <div className="py-4">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            <NextLink
              href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
            >
              <div className="m-0 mr-4 w-28 h-28 bg-gray-200 relative rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  height={200}
                  width={200}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </NextLink>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <NextLink
                href={`/product/${productSlug}/${variantSlug}?size=${sizeId}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap overflow-ellipsis "
              >
                {product.name}
              </NextLink>
            </div>
            {/* Style-Size */}
            <div className="my-1">
              <button className="text-black relative h-6 bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-6 rounded-xl font-bold cursor-pointer outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {product.size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price */}
            <div className="flex items-center  justify-between mt-2 relative">
              <div>
                <span className="inline-block break-all">
                  £{product.price.toFixed(2)} * {product.quantity} = £
                  {(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProductCard;
