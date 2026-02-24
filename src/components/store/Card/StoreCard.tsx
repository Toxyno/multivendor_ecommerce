"use client";
import followStore from "@/actions/User/followStore";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Check, MessageSquareMore, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface StoreCardProps {
  store: {
    storeId: string | null;
    url: string | null;
    name: string | null;
    logo: string | null;
    followersCount: number;
    isUserFollowingStore: boolean;
  };
}

const StoreCard = ({ store }: StoreCardProps) => {
  const { storeId, name, logo, url, followersCount, isUserFollowingStore } =
    store;
  const [following, setFollowing] = useState<boolean>(isUserFollowingStore);
  const [storeFollowersCount, setStoreFollowersCount] =
    useState<number>(followersCount);
  const { isSignedIn } = useUser();
  const router = useRouter();
  if (!store) return null;

  const handleStoreFollow = async () => {
    if (!isSignedIn) router.push("/sign-in");
    try {
      const resp = await followStore(storeId ?? "");
      setFollowing(resp);
      if (resp) {
        setStoreFollowersCount((prev) => prev + 1);
      } else {
        setStoreFollowersCount((prev) => Math.max(prev - 1, 0));
      }
      toast.success(
        resp
          ? "You are now following the store"
          : "You have unfollowed the store",
      );
    } catch (error) {
      toast.error(
        `Something went wrong. Please try again. Error: ${(error as Error).message}`,
      );
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#f5f5f5] flex items-center justify-between rounded-xl py-3 px-4">
        <div className="flex">
          <Link href={`/store/${url}`}>
            <Image
              src={logo || ""}
              alt={name || "Store Logo"}
              width={50}
              height={50}
              className="w-12 h-12 object-cover rounded-full"
            />
          </Link>
          <div className="mx-2">
            <div className="text-xl font-bold leading-6">
              <Link href={`/store/${url}`} className="text-black">
                {name}
              </Link>
            </div>
            <div className="text-sm leading-5 mt-1">
              <strong>100%</strong>
              {" Postive FeedBack "}| <strong>{storeFollowersCount}</strong>
              {" Followers"}
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            className={cn(
              "flex items-center border-black rounded-full cursor-pointer text-base font-bold h-9 mx-2 px-4 hover:bg-black hover:text-white",
              following ? "bg-black text-white" : "bg-white text-black",
            )}
            onClick={handleStoreFollow}
          >
            {following ? (
              <Check className="w-4 me-1" />
            ) : (
              <Plus className="w-4 me-1" />
            )}
            <span>{following ? "Following" : "Follow"}</span>
          </button>
          <button className="flex items-center border-black rounded-full cursor-pointer text-base font-bold h-9 mx-2 px-4 hover:bg-black hover:text-white">
            <MessageSquareMore className="w-4 me-2" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
