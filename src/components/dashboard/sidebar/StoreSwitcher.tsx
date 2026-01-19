"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

//import { StoreIcon, ChevronsUpDown, Command } from "lucide-react";
import {
  StoreIcon,
  ChevronsUpDown,
  Command as CommandIcon,
  Check,
  PlusCircle,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";
import { CommandSeparator } from "cmdk";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Record<string, any>[];
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, className }) => {
  const params = useParams();
  const router = useRouter();

  //We need to format the store data to be used in the popover
  const formattedStores = stores.map((store) => ({
    label: store.name,
    value: store.url,
  }));

  const [open, setOpen] = useState(false);

  //get the current store
  const activeStore = formattedStores.find(
    (store) => store.value === params.storeUrl
  ); // For now, we can set the first store as active

  function OnStoreSelect(store: { label: string; value: string }) {
    // Implement the logic to switch stores, e.g., navigate to the selected store's dashboard
    console.log("Selected store:", store);
    setOpen(false);
    router.push(`/dashboard/seller/stores/${store.value}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[230px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {activeStore?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Popover content for store switching can be added here */}
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search stores..." />
          <CommandList>
            <CommandEmpty>No stores found.</CommandEmpty>

            <CommandGroup heading="Stores">
              {formattedStores.map((store) => (
                <CommandItem
                  key={store.value}
                  value={store.label} // important for filtering
                  onSelect={() => OnStoreSelect(store)}
                  className="cursor-pointer"
                >
                  <StoreIcon className="h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn("ml-auto h-4 w-4 opacity-0", {
                      "opacity-100": activeStore?.value === store.value,
                    })}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                // Implement the logic to create a new store
                console.log("Create new store");
                setOpen(false);
                router.push(`/dashboard/seller/stores/new`);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
