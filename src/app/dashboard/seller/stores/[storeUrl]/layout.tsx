import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
const SellerStoreDashboardLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  //fetch the current user. if the user is not logged in, redirect to home page
  const user = await currentUser();
  if (!user) {
    //redirect to home page
    redirect("/");
  }

  //retrieve the list of store associated with the user
  const stores = await db.store.findMany({
    where: {
      ownerId: user.id,
    },
  });
  //   if (stores.length === 0) {
  //     //if no stores found, redirect to seller dashboard home page
  //     redirect("/dashboard/seller");
  //   }

  return (
    <div className="h-full w-full flex">
      <Sidebar stores={stores} />
      <div className="w-full ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default SellerStoreDashboardLayout;
