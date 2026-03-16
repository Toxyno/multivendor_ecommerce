import getUserShippingAddresses from "@/actions/User/getUserShippingAddresses";
import CheckoutContainer from "@/components/store/checkoutPage/CheckoutContainer";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CheckoutPage = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  //Get the user Cart
  const cart = await db.cart.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    redirect("/cart");
  }

  //Get the user shipping addresses
  const addresses = await getUserShippingAddresses();

  //Get the list of countries
  const countries = await db.country.findMany({
    orderBy: {
      name: "desc",
    },
  });

  console.log("Countries in CheckoutPage:", countries);

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-300 mx-auto py-5 px-5">
        <CheckoutContainer
          cart={cart}
          countries={countries}
          addresses={addresses}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
