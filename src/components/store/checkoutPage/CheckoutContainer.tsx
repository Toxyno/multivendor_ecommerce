"use client";

import { Country } from "@/generated/prisma";
import { CartWithCartItemsType, UserShippingAddressType } from "@/lib/type";
import { useState } from "react";
import UserShippingAddresses from "../shared/ShippingAddresses/UserShippingAddresses";
import CheckoutProductCard from "../Card/CheckoutProductCard";
import PlaceOrderCard from "../Card/PlaceOrderCard";

interface CheckoutContainerProps {
  cart: CartWithCartItemsType;
  countries: Country[];
  addresses: UserShippingAddressType[];
}

const CheckoutContainer = ({
  cart,
  countries,
  addresses,
}: CheckoutContainerProps) => {
  const [selectedAddress, setSelectedAddress] =
    useState<UserShippingAddressType | null>(null);
  return (
    <div className="flex">
      <div className="flex-1 my-3">
        {/* UserShippingAddresses */}
        <UserShippingAddresses
          addresses={addresses}
          countries={countries}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="w-full py-4 px-4 bg-white my-3">
          <div className="relative">
            {cart.cartItems.map((product) => (
              // checkoutProductCard
              <CheckoutProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Placeorder Card */}
      <PlaceOrderCard
        cartId={cart.id}
        shippingFees={cart.shippingFeesTotal}
        totalAmount={cart.cartTotalWithShippingFees}
        subTotal={cart.cartTotalWithoutShippingFees}
        shippingAddress={selectedAddress}
      />

      {/* Cart Side */}
    </div>
  );
};

export default CheckoutContainer;
