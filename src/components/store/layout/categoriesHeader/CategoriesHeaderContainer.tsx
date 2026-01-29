"use client";

import { Category } from "@/types/Category";
import { OfferTags } from "@/types/OfferTags";
import { useState } from "react";
import CategoriesMenu from "./CategoriesMenu";
import OfferTagsLinks from "./OfferTagsLinks";

const CategoriesHeaderContainer = ({
  categories,
  offerTags,
}: {
  categories: Category[];
  offerTags: OfferTags[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      {/* Category Menu */}
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />

      {/* Offer tags links */}
      <OfferTagsLinks offerTags={offerTags} />
    </div>
  );
};

export default CategoriesHeaderContainer;
