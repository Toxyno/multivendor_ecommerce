import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const UserInfo = ({ user }: { user: User | null }) => {
  const role = user?.privateMetadata?.role as string | undefined;
  return (
    <div>
      <div>
        <Button
          className="w-full mt-5 mb-4 flex items-center justify-between py-10"
          variant="ghost"
        >
          <div className="flex items-center text-left gap-2">
            <Avatar className="w-16 h-16 rounded-full overflow-hidden">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.firstName || "User Avatar"}
              />
              <AvatarFallback className="bg-primary text-white flex items-center justify-center rounded-full">
                {user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-1">
              {user?.firstName || "User"} {user?.lastName || ""}
              <span className="text-muted-foreground">
                {user?.emailAddresses?.[0]?.emailAddress || "No Email"}
              </span>
              <span className="w-fit">
                <Badge variant="secondary" className="capitalize">
                  {role?.toLocaleLowerCase()} Dashboard
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
