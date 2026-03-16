import { ShippingAddress } from "@/generated/prisma";
import { Button } from "../ui/button";
import FastDelivery from "./FastDelivery";
import { SecurityPrivacyCard } from "../productPage/ReturnSecurityPrivacyCard";
import toast from "react-hot-toast";
import placeOrder from "@/actions/User/placeOrder";
import { redirect } from "next/navigation";
import useCartStore from "@/cartStore/useCartStore";
import emptyUserCart from "@/actions/User/emptyUserCart";

interface PlaceOrderCardProps {
  shippingFees: number;
  totalAmount: number;
  subTotal: number;
  shippingAddress: ShippingAddress | null;
  cartId: string;
}

const PlaceOrderCard = ({
  shippingFees,
  totalAmount,
  subTotal,
  shippingAddress,
  cartId,
}: PlaceOrderCardProps) => {
  //   const emptyCart = useCartStore((state) => ({
  //     clearCart: state.emptyCart,
  //   }));
  const emptyCart = useCartStore((s) => s.emptyCart); // ✅

  const handlePlaceOrder = async (
    shippingAddress: ShippingAddress | null,
    cartId: string,
  ) => {
    // Handle place order logic here, such as validating the shipping address,
    // calculating the total amount, and sending the order data to the server.
    if (!shippingAddress) {
      toast.error("Please select a shipping address before placing the order.");
      return;
    }
    const order = await placeOrder(shippingAddress, cartId);
    if (order) {
      toast.success("Order placed successfully!");
      emptyCart();
      await emptyUserCart();
      redirect(`/orders/${order.orderId}`);
    }
    console.log("Place Order button clicked");
  };
  return (
    <div className="sticky top-4 mt-3 ml-5 w-95 max-h-max">
      <div className="relative py-4 px-6 bg-white">
        <h1 className="text-gray-900 text-2xl font-bold mb-4">Summary</h1>
        <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
          <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
            Subtotal
          </h2>
          <h3 className="flex-1 w-0 min-w-0 text-right">
            <span className="px-0 5 text-2xl text-black">
              <div className="text-black text-xl inline-block break-all">
                ${subTotal.toFixed(2)}
              </div>
            </span>
          </h3>
        </div>
        <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
          <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
            Shipping Fees
          </h2>
          <h3 className="flex-1 w-0 min-w-0 text-right">
            <span className="px-0 5 text-2xl text-black">
              <div className="text-black text-xl inline-block break-all">
                ${shippingFees.toFixed(2)}
              </div>
            </span>
          </h3>
        </div>
        <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
          <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
            Total
          </h2>
          <h3 className="flex-1 w-0 min-w-0 text-right">
            <span className="px-0 5 text-2xl text-black">
              <div className="text-black text-xl inline-block break-all">
                ${totalAmount.toFixed(2)}
              </div>
            </span>
          </h3>
        </div>
        <div className="pt-2.5">
          <Button onClick={() => handlePlaceOrder(shippingAddress, cartId)}>
            <span>Place Order</span>
          </Button>
        </div>
      </div>
      <div className="mt-2 p-4 bg-white px-6">
        <FastDelivery />
      </div>
      <div className="mt-2 p-4 bg-white px-6">
        <SecurityPrivacyCard />
      </div>
    </div>
  );
};

export default PlaceOrderCard;
