"use client";

import useCartStore from "@/cartStore/useCartStore";
import { CartProductType } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Trash,
  Truck,
} from "lucide-react";

import Image from "next/image";
import NextLink from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CartProductProps {
  product: CartProductType;
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
  selectedItems: CartProductType[];
  setTotalShipping: Dispatch<SetStateAction<number>>;
  totalShipping: number;
}

const CartProduct = ({
  product,
  setSelectedItems,
  selectedItems,
  setTotalShipping,
}: CartProductProps) => {
  const {
    productId,
    variantId,
    sizeId,
    size,
    name,
    variantName,
    image,
    quantity,
    price,
    stock,
    weight,
    shippingMethod,
    shippingService,
    shippingFee,
    extraShippingFee,
    productSlug,
    variantSlug,
  } = product;

  const unique_id = `${productId}-${variantId}-${sizeId}`;

  const totalPrice = price * quantity;

  const [shippingInfo, setShippingInfo] = useState({
    initialFee: 0,
    extraFee: 0,
    totalFee: 0,
    method: shippingMethod,
    weight,
    shippingService,
  });

  const calculateShippingFee = () => {
    let initialFee = 0;
    let extraFee = 0;
    let totalFee = 0;

    if (shippingMethod === "ITEM") {
      initialFee = shippingFee;
      extraFee = quantity > 1 ? extraShippingFee * (quantity - 1) : 0;
      totalFee = initialFee + extraFee;
    } else if (shippingMethod === "WEIGHT") {
      totalFee = shippingFee * weight * quantity;
    } else if (shippingMethod === "FIXED") {
      totalFee = shippingFee;
    }

    setTotalShipping((prev) => prev - shippingInfo.totalFee + totalFee);

    setShippingInfo({
      initialFee,
      extraFee,
      totalFee,
      method: shippingMethod,
      weight,
      shippingService,
    });
  };

  const handleSelectProduct = () => {
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId,
      );

      return exists
        ? prev.filter(
            (item) =>
              !(
                item.productId === product.productId &&
                item.variantId === product.variantId &&
                item.sizeId === product.sizeId
              ),
          )
        : [...prev, product];
    });
  };

  const updateProductQuantityHandler = (type: "add" | "remove") => {
    if (type === "add" && quantity < stock) {
      updateProductQuantity(product, quantity + 1);
    } else if (type === "remove" && quantity > 1) {
      updateProductQuantity(product, quantity - 1);
    }
  };

  useEffect(() => {
    calculateShippingFee();
  }, [quantity]);

  const selected = selectedItems.some(
    (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`,
  );

  const { updateProductQuantity, removeFromCart } = useCartStore(
    (state) => state,
  );

  return (
    <div className="bg-white px-6 border-t border-t-[#ebebeb] select-none">
      <div className="py-4">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            {stock > 0 && (
              <label htmlFor={unique_id} className="mr-2 cursor-pointer">
                <span
                  className={cn(
                    "w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-600",
                    { "border-orange-600": selected },
                  )}
                >
                  {selected && (
                    <span className="bg-orange-600 w-5 h-5 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 text-white mt-0.5" />
                    </span>
                  )}
                </span>
                <input
                  type="checkbox"
                  id={unique_id}
                  hidden
                  checked={selected}
                  onChange={handleSelectProduct}
                />
              </label>
            )}

            <NextLink
              href={`/product/${productSlug}?variant=${variantSlug}&size=${sizeId}`}
              className="m-0 mr-4 ml-2 block"
            >
              <div className="w-28 h-28 bg-gray-200 relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  height={200}
                  width={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </NextLink>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <NextLink
                href={`/product/${productSlug}?variant=${variantSlug}&size=${sizeId}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap overflow-ellipsis "
              >
                {name} . {variantName}
              </NextLink>
              <div className="absolute top-0 right-0 ">
                <span className="mr-2.5 cursor-pointer inline-block">
                  <Heart className="w-4 hover:stroke-orange-600" />
                </span>
                <span
                  className="cursor-pointer inline-block"
                  onClick={() => removeFromCart(product)}
                >
                  <span className="sr-only">Remove {name} from cart</span>
                  <Trash className="w-4 hover:stroke-orange-600" />
                </span>
              </div>
            </div>
            {/* Style-Size */}
            <div className="my-1">
              <button className="text-black relative h-[24px] bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-6 rounded-xl font-bold cursor-pointer outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price-Delivery */}
            <div className="flex items-center  justify-between mt-2 relative">
              <div>
                <span className="inline-block break-all">
                  £{price.toFixed(2)} * {quantity} = £{totalPrice.toFixed(2)}
                </span>
              </div>
              {/* Quantity Changer */}
              <div className="text-xs">
                <div className="text-gray-900 text-sm leading-6 list-none inline-flex items-center">
                  <div
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                    onClick={() => updateProductQuantityHandler("remove")}
                  >
                    <Minus className="w-3 stroke-[#555]" />
                  </div>
                  <input
                    type="text"
                    value={quantity}
                    min={1}
                    max={stock}
                    className="m-1 h-6 w-8 bg-white border-none leading-6 tracking-normal text-center outline-none text-gray-900 font-bold"
                  />
                  <div
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                    onClick={() => updateProductQuantityHandler("add")}
                  >
                    <Plus className="w-3 stroke-[#555]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping Info */}
            <div className="mt-1 text-xs text-[#999] cursor-pointer">
              <div className="flex items-center mb-1">
                <span>
                  <Truck className="w-4 inline-block  text-[#01A971]" />
                  <span className="ml-1">
                    {shippingInfo.totalFee > 0 ? (
                      <span className="text-[#01A971] ml-1">
                        {shippingMethod === "ITEM" ? (
                          <>
                            £{shippingInfo.initialFee} (first item) +{" "}
                            {quantity - 1} items x £{extraShippingFee}{" "}
                            (additional items) = £
                            {shippingInfo.totalFee.toFixed(2)}
                          </>
                        ) : shippingMethod === "WEIGHT" ? (
                          <>
                            £{shippingFee} x {shippingInfo.weight}kg x{" "}
                            {quantity}
                            {quantity > 1 ? "items" : "item"} = £
                            {shippingInfo.totalFee.toFixed(2)}
                          </>
                        ) : (
                          <>Fixed Fee: £{shippingInfo.totalFee.toFixed(2)}</>
                        )}
                      </span>
                    ) : (
                      <span className="text-[#01A971] ml-1">Free Shipping</span>
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;

// "use client";
// import { CartProductType } from "@/lib/type";
// import { cn } from "@/lib/utils";
// import { Check } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";

// interface CartProductProps {
//   // Define the props for the CartProduct component here
//   product: CartProductType; // Assuming CartProductType is defined elsewhere
//   setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
//   selectedItems: CartProductType[];
//   setTotalShipping: Dispatch<SetStateAction<number>>;
//   totalShipping: number;
// }

// const CartProduct = ({
//   product,
//   setSelectedItems,
//   selectedItems,
//   setTotalShipping,
//   totalShipping,
// }: CartProductProps) => {
//   console.log(product, "This is the product prop in CartProduct component");
//   //Destructure the product properties
//   const {
//     productId,
//     variantId,
//     name,
//     variantName,
//     sizeId,
//     image,
//     price,
//     quantity,
//     stock,
//     size,
//     weight,
//     shippingMethod,
//     shippingService,
//     shippingFee,
//     extraShippingFee,
//     productSlug,
//     variantSlug,
//   } = product;

//   const unique_id = `${productId}-${variantId}-${sizeId}`;
//   console.log(`this is the image ${image}`);

//   //define statet to hold the shipping info
//   const [shippingInfo, setShippingInfo] = useState({
//     initialFee: 0,
//     extraFee: 0,
//     totalFee: 0,
//     method: shippingMethod,
//     weight: weight,
//     shippingService: shippingService,
//   });

//   //Function to calculate the Shipping fee
//   const calculateShippingFee = () => {
//     let initialFee = 0;
//     let extraFee = 0;
//     let totalFee = 0;

//     if (shippingMethod === "ITEM") {
//       initialFee = shippingFee;
//       extraFee = quantity > 1 ? extraShippingFee * (quantity - 1) : 0;
//       totalFee = initialFee + extraFee;
//     } else if (shippingMethod === "WEIGHT") {
//       totalFee = shippingFee * weight * quantity;
//     } else if (shippingMethod === "FIXED") {
//       totalFee = shippingFee;
//     }

//     //Subtract the previous shipping total for this product before updateing
//     setTotalShipping((prevTotal) => {
//       return prevTotal - shippingInfo.totalFee + totalFee;
//     });

//     //Update the shipping info state
//     setShippingInfo({
//       initialFee,
//       extraFee,
//       totalFee,
//       method: shippingMethod,
//       weight: weight,
//       shippingService: shippingService,
//     });
//   };

//   //handle selected Prosuct
//   const handleSelectProduct = () => {
//     setSelectedItems((prev) => {
//       const exists = prev.some(
//         (item) =>
//           item.productId === product.productId &&
//           item.variantId === product.variantId &&
//           item.sizeId === product.sizeId,
//       );
//       return exists
//         ? prev.filter((item) => item !== product) // Remove if exists
//         : [...prev, product]; // Add if not exists
//     });
//   };

//   //re-Calculate the shipping fees whenever the quantity changes
//   useEffect(() => {
//     calculateShippingFee();
//   }, [quantity]);

//   const selected = selectedItems.find(
//     (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`,
//   );

//   return (
//     <div className="bg-white px-6 border-t border-t-[#ebebeb] select-none">
//       <div className="py-4">
//         <div className="relative flex self-start">
//           {/* Image */}
//           <div className="flex items-center">
//             {stock > 0 && (
//               <label
//                 htmlFor={unique_id}
//                 className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-2 cursor-pointer align-middle"
//               >
//                 <span className="leading-8 inline-flex p-0.5 cursor-pointer ">
//                   <span
//                     className={cn(
//                       "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-600",
//                       {
//                         "border-orange-600": selected,
//                       },
//                     )}
//                   >
//                     {selectedItems && (
//                       <span className="bg-orange-600  w-5 h-5 rounded-full flex items-center justify-center">
//                         <Check className="w-3.5 text-white mt-0.5" />
//                       </span>
//                     )}
//                   </span>
//                 </span>
//                 <input
//                   type="checkbox"
//                   id={unique_id}
//                   hidden
//                   checked={selected}
//                   onChange={() => handleSelectProduct()}
//                 />
//               </label>
//             )}
//             <Link
//               href={`/product/${productSlug}?variant=${variantSlug}?size=${sizeId}`}
//             >
//               <div className="m-0 mr-4 ml-2 w-28 h-28 bg-gray-200 relative rounded-lg">
//                 <Image
//                   src={product.image}
//                   alt={name}
//                   height={200}
//                   width={200}
//                   className="w-full h-full object-cover rounded-md"
//                 />
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartProduct;
("");
