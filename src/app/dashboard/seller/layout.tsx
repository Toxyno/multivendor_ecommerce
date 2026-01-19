import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const SellerDashboardLayout = async ({ children }: { children: ReactNode }) => {
  const user = await currentUser();
  if (!user) redirect("/");

  const role = (
    user.privateMetadata?.role as string | undefined
  )?.toUpperCase();

  if (role !== "SELLER") redirect("/");

  return (
    // <div className="h-dvh overflow-hidden">
    //   <main className="h-full overflow-y-auto">
    //     <div className="p-6">{children}</div>
    //   </main>
    // </div>
    <div>{children}</div>

    //<div className="w-full mt-18.75 p-4">{children}</div>
  );
};

export default SellerDashboardLayout;
