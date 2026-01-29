"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types/Category";
import { ChevronDown, MenuIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const CategoriesMenu = ({
  categories,
  open,
  setOpen,
}: {
  categories: Category[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative z-50"
      role="menu"
      tabIndex={0}
      aria-haspopup="true"
      // Desktop hover
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-expanded={open}
        aria-label="Categories menu"
        // Mobile tap
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-12 xl:w-[256px] h-12 xl:h-11 rounded-full bg-[#535353] text-white relative flex items-center cursor-pointer transition-all duration-150 ease-in-out select-none",
          {
            "w-[256px] bg-[#f5f5f5] text-black rounded-t-4xl rounded-b-none scale-100":
              open,
            "scale-90": !open,
          },
        )}
      >
        {/* Menu icon */}
        <MenuIcon
          className={cn(
            "absolute top-1/2 -translate-y-1/2 transition-all duration-150",
            {
              "left-5": open,
              "left-3": !open,
            },
          )}
        />

        {/* Label */}
        <span
          className={cn(
            "ml-11 whitespace-nowrap transition-all duration-150",
            "hidden lg:inline-flex", // desktop always visible
            open && "inline-flex lg:inline-flex", // mobile visible when open
          )}
        >
          All Categories
        </span>
        <ChevronDown
          className={cn("hidden xl:inline-flex scale-75 absolute right-3", {
            "inline-flex": open,
          })}
        />
      </button>
      {/* Dropdown menu */}
      <ul
        className={cn(
          "absolute top-10 left-0 w-[256px] bg-[#f5f5f5] shadow-lg overflow-y-auto scrollbar",
          "transition-all duration-200 ease-out origin-top",
          open
            ? "max-h-[523px] opacity-100 translate-y-0 pointer-events-auto"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/browse?category=${category.url}`}
            className="relative flex items-center m-0 p-3 pl-6 hover:bg-white text-[#222]"
          >
            <li className="relative flex items-center m-0 p-3 pl-6 hover:bg-white">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={100}
                  height={100}
                  className="w-[20px] h-[20px] rounded-full object-cover flex items-center justify-center text-sm text-[#222]"
                />
              ) : (
                <div className="w-18 h-18 rounded-full bg-[#ddd] flex items-center justify-center text-sm text-[#222]">
                  {category.name?.charAt(0) ?? ""}
                </div>
              )}
              <span className="text-sm font-normal ml-2 overflow-hideen line-clamp-2 wrap-break-word text-[#222]">
                {category.name}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesMenu;
