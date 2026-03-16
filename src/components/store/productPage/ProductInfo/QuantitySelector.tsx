import useCartStore from "@/cartStore/useCartStore";
import { Size } from "@/generated/prisma";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType } from "@/lib/type";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";

interface QuantitySelectorProps {
  productId: string;
  variantId: string;
  quantity: number;
  sizeId: string | null;
  handleChange: (property: keyof CartProductType, value: any) => void;
  size: Size[];
  stock: number;
}

const QuantitySelector = ({
  productId,
  variantId,
  quantity,
  sizeId,
  handleChange,
  size,
  stock,
}: QuantitySelectorProps) => {
  //Get CArt product ifit exist in cart, the get added quanityt
  const cart = useFromStore(
    useCartStore,
    (state) => state.cart,
    [],
  ) as CartProductType[];
  console.log(`The cart is:`, cart);

  //useEffect hook to handle changes when sizeId updates
  useEffect(() => {
    handleChange("quantity", 1);
  }, [handleChange, sizeId]);

  const maxQty = useMemo(() => {
    const search_product = cart?.find(
      (p) =>
        p.productId === productId &&
        p.variantId === variantId &&
        p.sizeId === sizeId,
    );
    return search_product ? stock - search_product.quantity : stock;
  }, [cart, productId, variantId, sizeId, stock]);

  console.log(`The max quantity is:`, maxQty, ` and the stock is:`, stock);
  if (!sizeId) return null;

  function handleIncrease() {
    if (quantity < maxQty) {
      handleChange("quantity", quantity + 1);
    }
  }

  function handleDecrease() {
    if (quantity > 1) {
      handleChange("quantity", quantity - 1);
    }
  }

  return (
    <div className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg">
      <div className="w-full flex justify-between items-center gap-x-5">
        <div className="grow">
          <span className="block text-xs text-gray-500">
            <b>Select Quantity:</b>
          </span>
          <span className="block text-xs text-gray-500">
            {maxQty !== stock
              ? `Only ${maxQty} items left in stock`
              : `${stock} items available in stock`}
          </span>
          <input
            type="number"
            className="w-full p-0 bg-transparent border-0 focus:outline-0 text-gray-800"
            min={1}
            value={quantity}
            max={maxQty <= 0 ? 0 : quantity}
            readOnly
          />
        </div>
        <div className=" flex justify-end items-center gap-x-1.5 ">
          <button
            onClick={handleDecrease}
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            disabled={quantity === 1}
          >
            <Minus className="w-3" />
          </button>

          <button
            onClick={handleIncrease}
            className=" size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            disabled={quantity === maxQty}
          >
            <Plus className="w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
