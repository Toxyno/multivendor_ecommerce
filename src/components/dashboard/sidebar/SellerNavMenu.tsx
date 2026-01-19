"use client";

import {
  CommandEmpty,
  CommandInput,
  CommandList,
  Command,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { icons } from "@/constants/icons";
import { DashBoardSideBarMenuInterface } from "@/lib/type";
import { cn } from "@/lib/utils";
// import { CommandGroup } from "cmdk";
import Link from "next/dist/client/link";
import { usePathname } from "next/navigation";

type DashboardSidebarMenuProps = DashBoardSideBarMenuInterface;

const SellerNavMenu = ({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuProps[];
}) => {
  const pathname = usePathname();
  console.log("The pathname is:", pathname);
  const storeUrlStart = pathname.split("/stores/")[1];
  const activeStore = storeUrlStart ? storeUrlStart.split("/")[0] : "";
  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map((menu, index) => {
              let icon;
              const iconSearch = icons.find((ic) => ic.value === menu.icon);
              if (iconSearch) {
                icon = <iconSearch.path />;
              }

              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-background":
                      menu.link === ""
                        ? pathname === `/dashboard/seller/stores/${activeStore}`
                        : `/dashboard/seller/stores/${activeStore}/${menu.link}` ===
                          pathname,
                  })}
                >
                  <Link
                    href={`/dashboard/seller/stores/${activeStore}/${menu.link}`}
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                  >
                    {icon}
                    <span className="ml-2">{menu.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
};

export default SellerNavMenu;
