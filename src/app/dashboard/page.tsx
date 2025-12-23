import { currentUser } from "@clerk/nextjs/server";
//import { redirect } from "next/dist/client/components/navigation";
import { redirect } from "next/navigation";

const DashBoardPage = async () => {
  const user = await currentUser();

  const role = (
    user?.privateMetadata?.role as string | undefined
  )?.toUpperCase();
  console.log("This is the current Role of the User:", role);

  if (!role || role === "USER") redirect("/");

  if (role === "ADMIN") redirect("/dashboard/admin");
  if (role === "SELLER") redirect("/dashboard/seller");

  // fallback if role is something unexpected
  redirect("/");
};

export default DashBoardPage;
