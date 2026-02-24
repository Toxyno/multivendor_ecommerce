"use client";

import { ProductShippingDetailsType } from "@/lib/type";
import { ChevronDown, ChevronRight, ChevronUp, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import ProductShippingFee from "./ProductShippingFee";
import { getShippingDateRange } from "@/lib/utils";

interface ShippingDetailsProps {
  readonly shippingDetails: ProductShippingDetailsType | boolean;
  readonly quantity: number;
  readonly weight: number;
}

export default function ShippingDetails({
  shippingDetails,
  quantity,
  weight,
}: ShippingDetailsProps) {
  const [shippingTotal, setShippingTotal] = useState(0);
  const [toggle, setToggle] = useState<boolean>(false);

  if (typeof shippingDetails === "boolean") return null;

  const countryName = shippingDetails?.countryName;
  const shippingFee = shippingDetails?.shippingFee || 0;
  const extraShippingFee = shippingDetails?.extraShippingFee || 0;
  const shippingMethod = shippingDetails?.shippingFeeMethod || "";

  useEffect(() => {
    let newShippingTotal = 0;
    const qty = quantity - 1;

    switch (shippingMethod) {
      case "ITEM":
        newShippingTotal = shippingFee + qty + extraShippingFee;
        break;
      case "WEIGHT":
        newShippingTotal = shippingFee * weight;
        break;
      case "FIXED":
        newShippingTotal = shippingFee;
        break;
      default:
        break;
    }

    setShippingTotal(newShippingTotal);
  }, [shippingMethod, shippingFee, extraShippingFee, quantity, weight]);

  const { minstring, maxstring } = getShippingDateRange(
    shippingDetails?.deliveryTimeMin ?? 0,
    shippingDetails?.deliveryTimeMax ?? 0,
  );
  return (
    <div>
      <div className="space-y-1 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1 m-2">
            <Truck className="w-4" />
            {shippingDetails?.freeShipping ? (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Free Shipping to&nbsp;<span>{countryName}</span>
                </span>
              </span>
            ) : (
              <span className="text-sm font-bold flex items-center">
                <span>
                  Shipping to&nbsp;<span>{countryName}</span>
                </span>
                <span>&nbsp;for £{shippingTotal}</span>
              </span>
            )}
          </div>
          <ChevronRight className="w-3 " />
        </div>
        <span className="flex items-center text-sm ml-5">
          Service:&nbsp;
          <strong className="text-sm">
            {shippingDetails?.shippingService || "N/A"}
          </strong>
        </span>
        <span className="flex items-center text-sm ml-5">
          Delivery:&nbsp;
          <strong className="text-sm">
            {minstring} - {maxstring}
          </strong>
        </span>
        {/* Product Shipping fee */}
        {!shippingDetails?.freeShipping && toggle && (
          <ProductShippingFee
            fee={shippingFee}
            extraFee={extraShippingFee}
            weight={weight}
            quantity={quantity}
            method={shippingMethod}
          />
        )}
        <div
          onClick={() => setToggle((prev) => !prev)}
          className="max-w-[calc(100%-2rem)] ml-4 flex items-center bg-gray-100 hover:bg-gray h-5 cursor-pointer"
        >
          <div className="w-full flex items-center justify-between gap-x-1 px-2">
            <span className="text-xs">
              {toggle ? "Hide details" : "Show Fee Breakdown"}{" "}
            </span>
            {toggle ? (
              <ChevronUp className="w-4" />
            ) : (
              <ChevronDown className="w-4 " />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { ProductShippingDetailsType } from "@/lib/type";
// import { Truck } from "lucide-react";
// import { useEffect, useState } from "react";

// interface ShippingDetailsProps {
//   shippingDetails: ProductShippingDetailsType;
//   quantity: number;
//   weight: number;
// }

// const ShippingDetails = ({
//   shippingDetails,
//   quantity,
//   weight,
// }: ShippingDetailsProps) => {
//   const [shippingTotal, setShippingTotal] = useState<number>(0);

//   const {
//     countryName,
//     deliveryTimeMax,
//     deliveryTimeMin,
//     shippingfee,
//     extraShippingFee,
//     returnPolicy,
//     shippingMethod,
//   } = shippingDetails;

//   useEffect(() => {
//     let newShippingTotal = 0;
//     switch (shippingMethod) {
//       case "ITEM":
//         newShippingTotal =
//           shippingfee * quantity + extraShippingFee * (quantity - 1);
//         break;
//       case "WEIGHT":
//         newShippingTotal = shippingfee * weight;
//         break;
//       case "FIXED":
//         newShippingTotal = shippingfee;
//         break;
//       default:
//         newShippingTotal = 0;
//     }
//     setShippingTotal(newShippingTotal);
//   }, [shippingMethod, shippingfee, extraShippingFee, quantity, weight]);

//   if (typeof shippingDetails === "boolean") return null;

//   return (
//     <div>
//       <div className="space-y-1">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-x-1">
//             <Truck className="w-4 stroke-black" />
//             <span className="text-sm font-bold flex items-center">
//               Shipping to &nbsp; <span>{countryName}</span>
//             </span>
//             <span>&nbsp; for £{shippingTotal}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShippingDetails;
