import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/dist/client/components/navigation";
import { ReactNode } from "react";

const children = async ({ children }: { children: ReactNode }) => {
  //Block Non Admin users from accessing admin dashboard
  const user = await currentUser();

  if (
    !user ||
    (user &&
      (user?.privateMetadata?.role as string | undefined)?.toUpperCase() !==
        "ADMIN")
  ) {
    redirect("/");
  }
  return (
    <div className="w-full h-full">
      {/*Sidebar can be added here  */}
      <Sidebar isAdmin={user?.privateMetadata?.role === "ADMIN"} />
      <div className="ml-75">
        {/* Header can be added here */}
        <Header />
        <div className="w-full mt-18.75 p-4">{children}</div>
      </div>
    </div>
  );
};

export default children;
