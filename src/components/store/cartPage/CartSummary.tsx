import { CartProductType } from "@/lib/type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import saveUserCart from "@/actions/User/saveUserCart";
import { PulseLoader } from "react-spinners";

interface CartSummaryProps {
  // Define any props you need for the CartSummary component
  cartItem: CartProductType[];
  shippingFees: number;
}

const CartSummary = ({ cartItem, shippingFees }: CartSummaryProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Calculate the subtotal by summing up the price of each item multiplied by its quantity
  const subtotal = cartItem.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const handleSaveCart = async () => {
    try {
      setLoading(true);
      const res = await saveUserCart(cartItem);
      if (res) {
        toast.success("Cart saved successfully!");
        router.push("/checkout");
      } else {
        toast.error("Failed to save cart. Please try again.");
      }
    } catch (error: any) {
      toast.error("Failed to save cart. Please try again. " + error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-4 px-6 bg-white ">
      <h1 className="text-gray-900 text-2xl font-bold mb-4">Order Summary</h1>
      <div className="mt-4 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Subtotal
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-black text-xl inline-block break-all">
              £{subtotal.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>

      <div className="mt-2 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Shipping Fees
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-black text-xl inline-block break-all">
              £{shippingFees.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>

      <div className="mt-2 font-medium flex items-center text-[#222] text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-2xl text-black">
            <div className="text-black text-xl inline-block break-all">
              £{(subtotal + shippingFees).toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="my-2.5">
        <button
          className="py-2.5 min-w-20 text-white border-0 bg-[#fd384f] h-11 leading-6 rounded-3xl w-full flex items-center justify-center font-bold whitespace-nowrap relative mt-4 cursor-pointer"
          onClick={handleSaveCart}
          // disabled={loading}
        >
          {loading ? (
            <PulseLoader color="#ffffff" size={10} />
          ) : (
            <span>Checkout({cartItem.length})</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
