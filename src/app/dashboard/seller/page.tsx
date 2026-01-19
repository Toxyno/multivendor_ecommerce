import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SellerDashBoardPage = async () => {
  //fetch the current usr and if the user is not authenticated the redirect to home page
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  //Retrieve list of stores associate with the authenticated user
  const stores = await db.store.findMany({
    where: {
      ownerId: user.id,
    },
  });

  //If no stores found redirect to create store page
  if (stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
  }

  //if stores found redirect to the first store's dashboard
  redirect(`/dashboard/seller/stores/${stores[0].url}`);
  //return <div>SellerDashBoardPage</div>;
};

export default SellerDashBoardPage;
