import { currentUser } from "@clerk/nextjs/server";
import UserMenuClient from "./UserMenuClient";

const UserMenu = async () => {
  const user = await currentUser();

  return (
    <UserMenuClient
      user={
        user
          ? {
              imageUrl: user.imageUrl,
              fullName: user.fullName ?? "User",
            }
          : null
      }
    />
  );
};

export default UserMenu;
