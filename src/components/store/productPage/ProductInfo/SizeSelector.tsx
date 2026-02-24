"use client";
import { Size } from "@/generated/prisma";
import { CartProductType } from "@/lib/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface SideSelectorProps {
  sizes: Size[];
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const SizeSelector = ({ sizes, sizeId, handleChange }: SideSelectorProps) => {
  //get the Path Name
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  function handleCartProductToBeAddedChange(size: Size) {
    handleChange("size", size.size);
    handleChange("sizeId", size.id);
  }

  // useEffect(() => {
  //   if (sizeId) {
  //     const search_size = sizes.find((size) => size.id === sizeId);
  //     if (search_size) {
  //       handleCartProductToBeAddedChange(search_size);
  //     }
  //   }
  // }, []);

  function handleSelectSize(size: Size) {
    params.set("sizeId", size.id);
    handleCartProductToBeAddedChange(size);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <span
          key={size.size}
          className="select-none border rounded-full px-5 py-1 hover:border-black cursor-pointer"
          style={{ borderColor: size.id === sizeId ? "#000" : "" }}
          onClick={() => {
            handleSelectSize(size);
          }}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default SizeSelector;
