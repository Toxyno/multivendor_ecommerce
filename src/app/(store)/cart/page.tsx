"use client";
import FastDelivery from "@/components/store/Card/FastDelivery";
import { SecurityPrivacyCard } from "@/components/store/productPage/ReturnSecurityPrivacyCard";

import useFromStore from "@/hooks/useFromStore";
import useCartStore from "@/cartStore/useCartStore";
import { useState } from "react";
import CartHeader from "@/components/store/cartPage/CartHeader";
import CartProduct from "@/components/store/Card/CartProduct";
import { CartProductType } from "@/lib/type";
import CartSummary from "@/components/store/cartPage/CartSummary";

const Cartpage = () => {
  const cartItems = useFromStore(
    useCartStore,
    (state) => state.cart,
    [],
  ) as Array<any>;

  console.log(`This is the cart items from the store:`, cartItems);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShipping, setTotalShipping] = useState<number>(0);

  return (
    <div>
      {cartItems.length > 0 ? (
        <div className="bg-[#f5f5f5]">
          <div className="max-w-300 mx-auto py-6 flex">
            <div className="min-w-0 flex-1">
              {/* Cart Header */}
              <CartHeader
                cartItems={cartItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                totalShipping={totalShipping}
                setTotalShipping={setTotalShipping}
              />
              <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                {/* Cart Item */}
                {cartItems.map((product) => (
                  <CartProduct
                    key={product.id}
                    product={product}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    setTotalShipping={setTotalShipping}
                    totalShipping={totalShipping}
                  />
                ))}
              </div>
            </div>
            {/* Cart Side */}
            <div className="sticky top-4 ml-5 w-95 max-h-max">
              {/* Cart Summary */}
              <CartSummary cartItem={cartItems} shippingFees={totalShipping} />
              <div className="mt-2 p-4 bg-white px-6">
                <FastDelivery />
              </div>
              <div className="mt-2 p-4 bg-white px-6">
                <SecurityPrivacyCard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        </div>
      )}
    </div>
  );
};

export default Cartpage;
