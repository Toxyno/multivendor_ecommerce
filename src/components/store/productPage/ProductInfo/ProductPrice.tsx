import { CartProductType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface SimlifiedSizeType {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface ProductPriceProps {
  sizeId?: string;
  sizes: SimlifiedSizeType[];
  isCard?: boolean;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const ProductPrice = ({
  sizeId,
  sizes,
  isCard,
  handleChange,
}: ProductPriceProps) => {
  if (!sizes?.length) return null;

  const calcDiscounted = (price: number, discount: number) =>
    discount > 0 ? price * (1 - discount / 100) : price;

  // ✅ If sizeId exists AND matches a size -> show exact price
  const selected = sizeId ? sizes.find((s) => s.id === sizeId) : undefined;
  if (selected) {
    const discountedNum = calcDiscounted(selected.price, selected.discount);
    const discountedStr = discountedNum.toFixed(2);
    const originalStr = selected.price.toFixed(2);

    const hasDiscount = selected.discount > 0 && discountedNum < selected.price;

    //update product to be added to cart with price and stock qunatity
    useEffect(() => {
      handleChange("price", discountedNum);
      handleChange("stock", selected.quantity);
    }, [discountedNum, selected.quantity, sizeId, handleChange]);

    return (
      <div>
        {/* Discounted price */}
        <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5">
          <span className={cn("inline-block text-4xl", { "text-lg": isCard })}>
            £{discountedStr}
          </span>
        </div>

        {/* Original price - STRIKETHROUGH */}
        {hasDiscount && (
          <span
            className={cn(
              "inline-block text-[#999] font-normal leading-6 mr-2 line-through",
              { "text-base": isCard, "text-xl": !isCard },
            )}
          >
            £{originalStr}
          </span>
        )}

        {/* Discount badge */}
        {selected.discount > 0 && (
          <span className="inline-block text-[#d3031c] text-xl leading-6">
            {selected.discount}% off
          </span>
        )}

        {!isCard && <p className="mt-2 text-xs">{selected.quantity} pieces</p>}
      </div>
    );
  }

  // ✅ If no sizeId -> ALWAYS show price range
  const discountedPrices = sizes.map((s) =>
    calcDiscounted(s.price, s.discount),
  );
  const min = Math.min(...discountedPrices);
  const max = Math.max(...discountedPrices);

  const minStr = min.toFixed(2);
  const maxStr = max.toFixed(2);

  const display = min === max ? `£${minStr}` : `£${minStr} - £${maxStr}`;

  const totalQuantity = sizes.reduce((t, s) => t + s.quantity, 0);

  return (
    <div>
      <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5">
        <span className={cn("inline-block text-4xl", { "text-lg": isCard })}>
          {display}
        </span>
      </div>

      {!isCard && (
        <>
          <div className="text-[#FD384F] text-xs leading-4 mt-1">
            Note: Select a size to see the exact price
          </div>
          <p className="mt-2 text-xs">{totalQuantity} pieces</p>
        </>
      )}
    </div>
  );
};

export default ProductPrice;

// import { cn } from "@/lib/utils";

// interface SimlifiedSizeType {
//   id: string;
//   size: string;
//   quantity: number;
//   price: number;
//   discount: number;
// }

// interface ProductPriceProps {
//   sizeId?: string | undefined;
//   sizes: SimlifiedSizeType[];
//   isCard?: boolean;
// }

// const ProductPrice = ({ sizeId, sizes, isCard }: ProductPriceProps) => {
//   if (!sizes?.length) return null;

//   const calcDiscounted = (price: number, discount: number) =>
//     discount > 0 ? price * (1 - discount / 100) : price;

//   // ✅ if sizeId exists AND matches a size -> show exact price
//   const selected = sizeId ? sizes.find((s) => s.id === sizeId) : undefined;
//   if (selected) {
//     const exact = calcDiscounted(selected.price, selected.discount).toFixed(2);
//     return (
//       <div>
//         <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5">
//           <span className={cn("inline-block text-4xl", { "text-lg": isCard })}>
//             ${exact}
//           </span>
//         </div>
//       </div>
//     );
//   }

//   // ✅ otherwise -> show price range
//   const discountedPrices = sizes.map((s) =>
//     calcDiscounted(s.price, s.discount),
//   );
//   const min = Math.min(...discountedPrices);
//   const max = Math.max(...discountedPrices);

//   // 🔍 Debug — this will tell you why you're seeing a single price
//   console.log("ProductPrice debug:", {
//     sizeId,
//     discountedPrices,
//     min,
//     max,
//     originalPrices: sizes.map((s) => s.price),
//     discounts: sizes.map((s) => s.discount),
//   });

//   const minStr = min.toFixed(2);
//   const maxStr = max.toFixed(2);

//   const display = min === max ? `$${minStr}` : `$${minStr} - $${maxStr}`;

//   const totalQuantity = sizes.reduce((t, s) => t + s.quantity, 0);

//   return (
//     <div>
//       <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5">
//         <span className={cn("inline-block text-4xl", { "text-lg": isCard })}>
//           {display}
//         </span>
//       </div>

//       {!isCard && (
//         <>
//           <div className="text-[#FD384F] text-xs leading-4 mt-1">
//             Note: Select a size to see the exact price
//           </div>
//           <p className="mt-2 text-xs">{totalQuantity} pieces</p>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProductPrice;

// import { cn } from "@/lib/utils";
// import { usePathname, useRouter } from "next/navigation";

// interface SimlifiedSizeType {
//   id: string;
//   size: string;
//   quantity: number;
//   price: number;
//   discount: number;
// }

// interface ProductPriceProps {
//   sizeId: string | undefined;
//   sizes: SimlifiedSizeType[];
//   isCard?: boolean;
// }

// const ProductPrice = ({ sizeId, sizes, isCard }: ProductPriceProps) => {
//   console.log(
//     "Rendering ProductPrice with sizeId:",
//     sizeId,
//     "and sizes:",
//     sizes,
//     " isCard:",
//     isCard,
//   );
//   //Import the usePathName hook from  the next.js to get the current URL path
//   const pathname = usePathname();

//   //Desctructure the replace methof from the NextJS useRouter hook to pragrammatically navigate between pages
//   const { replace } = useRouter();

//   //check of the sizes array is either undefined or has no length, return null if true
//   if (!sizes || sizes.length === 0) return null;

//   //Scenerio 1: If sizeId is not provided, calculate range of pricess and total quantity
//   if (!sizeId) {
//     console.log("Calculating price range and total quantity without sizeId");
//     //Calculate the discounted prices for all sizes
//     const totalQuantity = sizes.reduce(
//       (total, size) => total + size.quantity,
//       0,
//     );

//     const discountedPrices = sizes.map((size) => {
//       const discountAmount = size.price * (1 - size.discount / 100);
//       return size.discount > 0 ? discountAmount : size.price;
//     });

//     console.log(discountedPrices, "Discounted Prices without sizeId");
//     //Determine the minimum and maximum prices from the discounted prices
//     const minPrice = Math.min(...discountedPrices).toFixed(2);
//     const maxPrice = Math.max(...discountedPrices).toFixed(2);

//     console.log(minPrice, maxPrice, "Min and Max Prices without sizeId");

//     //if all the pricess are the same, return a single price, otherwise return a price range
//     const priceDiplay =
//       minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

//     console.log(priceDiplay, "Price Display without sizeId");

//     //if the discount exist when minPrice=MaxPrice
//     let discountAmount = 0;
//     if (minPrice === maxPrice) {
//       let check_discount = sizes.find((size) => size.discount > 0);
//       if (check_discount) {
//         discountAmount = check_discount.discount;
//       }

//       return (
//         <div>
//           <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5 ">
//             <span
//               className={cn("inline-block text-4xl text-nowrap", {
//                 "text-lg": isCard,
//               })}
//             >
//               {priceDiplay}
//             </span>
//           </div>
//           {!sizeId && !isCard && (
//             <div className="text-[#FD384F]  text-xs leading-4 mt-1">
//               <span>Note: Select a size to see the exact price</span>
//             </div>
//           )}
//           {!sizeId && !isCard && (
//             <p className="mt-2 text-xs">{totalQuantity} pieces</p>
//           )}
//         </div>
//       );
//     }
//   }

//   return <div></div>;
// };

// export default ProductPrice;

// import { cn } from "@/lib/utils";

// interface SimlifiedSizeType {
//   id: string;
//   size: string;
//   quantity: number;
//   price: number;
//   discount: number;
// }

// interface ProductPriceProps {
//   sizeId: string | undefined;
//   sizes: SimlifiedSizeType[];
//   isCard?: boolean;
// }

// const ProductPrice = ({ sizeId, sizes, isCard }: ProductPriceProps) => {
//   if (!sizes || sizes.length === 0) return null;

//   const calcDiscounted = (p: number, d: number) =>
//     d > 0 ? p * (1 - d / 100) : p;

//   // ✅ Case 1: No size selected -> show range or single price
//   if (!sizeId) {
//     const totalQuantity = sizes.reduce((total, s) => total + s.quantity, 0);

//     const discountedPrices = sizes.map((s) =>
//       calcDiscounted(s.price, s.discount),
//     );
//     const minPriceNum = Math.min(...discountedPrices);
//     const maxPriceNum = Math.max(...discountedPrices);

//     const minPrice = minPriceNum.toFixed(2);
//     const maxPrice = maxPriceNum.toFixed(2);

//     const priceDisplay =
//       minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

//     return (
//       <div>
//         <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5">
//           <span
//             className={cn("inline-block text-4xl text-nowrap", {
//               "text-lg": isCard,
//             })}
//           >
//             {priceDisplay}
//           </span>
//         </div>

//         {!isCard && (
//           <>
//             <div className="text-[#FD384F] text-xs leading-4 mt-1">
//               <span>Note: Select a size to see the exact price</span>
//             </div>
//             <p className="mt-2 text-xs">{totalQuantity} pieces</p>
//           </>
//         )}
//       </div>
//     );
//   }

//   // ✅ Case 2: Size selected -> show exact price
//   const selected = sizes.find((s) => s.id === sizeId);

//   // if invalid sizeId, avoid crashing / blank
//   if (!selected) return null;

//   const finalPrice = calcDiscounted(selected.price, selected.discount).toFixed(
//     2,
//   );

//   return (
//     <div>
//       <div className="text-[#FA6338] inline-block font-bold leading-none mr-2.5">
//         <span
//           className={cn("inline-block text-4xl text-nowrap", {
//             "text-lg": isCard,
//           })}
//         >
//           ${finalPrice}
//         </span>
//       </div>

//       {!isCard && <p className="mt-2 text-xs">{selected.quantity} pieces</p>}
//     </div>
//   );
// };

// export default ProductPrice;
