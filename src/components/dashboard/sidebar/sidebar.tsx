import Logo from "@/components/shared/logo";
import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import UserInfo from "./user-info";
import { adminDashBoardSidebarLinks } from "@/constants/data";
import SidebarNavMenu from "./SidebarNavMenu";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
  const user = await currentUser();

  return (
    <div className="w-75 border-r h-screen p-4 flex flex-col fixed top-0 left-0  bottom-0 ">
      <Logo width="100%" height="180px" />
      <span className="mt-0" />
      {user && <UserInfo user={user} />}
      {/* SidebarNavMenu component can be added here in the future */}
      {/* <SidebarNavMenu menuLinks={isAdmin ? adminDashBoardSidebarLinks : []} /> */}
      {isAdmin && <SidebarNavMenu menuLinks={adminDashBoardSidebarLinks} />}
    </div>
  );
};

export default Sidebar;
