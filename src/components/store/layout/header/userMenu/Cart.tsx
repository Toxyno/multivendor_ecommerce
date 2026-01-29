import { CartIcon } from "@/components/store/icons";
import Link from "next/link";

const Cart = () => {
  const totalItems = 5; // replace with real value

  return (
    <div className="relative flex h-11 items-center px-2 cursor-pointer">
      <Link href="/cart" className="relative flex items-center text-white">
        {/* ICON WRAPPER */}
        <span className="relative inline-block text-[32px]">
          <CartIcon />

          {/* BADGE */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white leading-none shadow-md">
              {totalItems}
            </span>
          )}
        </span>

        {/* LABEL
        <b className="ml-2 text-xs font-bold leading-4">Cart</b> */}
      </Link>
    </div>
  );
};

export default Cart;
