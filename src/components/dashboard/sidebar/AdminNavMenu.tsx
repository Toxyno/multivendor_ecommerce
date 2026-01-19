"use client";

import {
  CommandEmpty,
  CommandInput,
  CommandList,
  Command,
  CommandItem,
} from "@/components/ui/command";
import { icons } from "@/constants/icons";
import { DashBoardSideBarMenuInterface } from "@/lib/type";
import { cn } from "@/lib/utils";
import { CommandGroup } from "cmdk";
import Link from "next/dist/client/link";
import { usePathname } from "next/navigation";

const AdminNavMenu = ({
  menuLinks,
}: {
  menuLinks: DashBoardSideBarMenuInterface[];
}) => {
  const pathname = usePathname();
  console.log("The pathname is:", pathname);
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
                    "bg-accent text-accent-background": menu.link === pathname,
                  })}
                >
                  <Link
                    href={menu.link}
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

export default AdminNavMenu;
