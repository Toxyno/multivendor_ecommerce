import useCartStore from "@/cartStore/useCartStore";
import { CartProductType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface CartHeaderProps {
  cartItems: CartProductType[];
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
  totalShipping: number;
  setTotalShipping: Dispatch<SetStateAction<number>>;
}

const CartHeader = ({
  cartItems,
  selectedItems,
  setSelectedItems,
  totalShipping,
  setTotalShipping,
}: CartHeaderProps) => {
  const removemultipleFromCart = useCartStore(
    (state) => state.removeMultipleFromCart,
  );

  const cartLength = cartItems.length;
  const selectedLenght = selectedItems.length;

  const handleSelectAll = () => {
    const areAllSelected = cartItems.every((item) =>
      selectedItems.some((selected) => selected.productId === item.productId),
    );
    if (areAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems);
    }
  };

  const removeSelectedFromCart = () => {
    removemultipleFromCart(selectedItems);
    setSelectedItems((prevSelected) =>
      prevSelected.filter(
        (selected) =>
          !cartItems.some(
            (item) =>
              item.productId === selected.productId &&
              item.variantId === selected.variantId &&
              item.sizeId === selected.sizeId,
          ),
      ),
    );
  };

  return (
    <div className="bg-white py-4">
      <div>
        <div className="py-6 bg-white">
          <div className="flex items-center text-[#222] font-bold text-2xl px-6">
            <h1>Cart ({cartLength})</h1>
          </div>
        </div>
        <div className="flex justify-between bg-white pt-4 px-6">
          <div className="flex items-center justify-start w-full">
            <label
              className="p-0 text-gray-900 text-sm leading-6 list-none inline-flex items-center m-0 mr-2 cursor-pointer align-middle"
              onClick={() => handleSelectAll()}
            >
              <span className="leading-8 inline-flex">
                <span
                  className={cn(
                    "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-600",
                    {
                      "border-orange-600":
                        cartLength > 0 && selectedLenght === cartLength,
                    },
                  )}
                >
                  {cartLength > 0 && selectedLenght === cartLength && (
                    <span className="bg-orange-600 w-5 h-5 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 text-white mt-0.5" />
                    </span>
                  )}
                </span>
              </span>
              <span className="mt-0.5 leading-8 px-2 select-none">
                Select All Products
              </span>
            </label>

            {selectedItems.length > 0 && (
              <div
                className="pl-4 border border-1-[#ebebeb] cursor-pointer"
                onClick={removeSelectedFromCart}
              >
                <div className="text-[#317ee8] font-semibold leading-5">
                  Delete all selected products
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
