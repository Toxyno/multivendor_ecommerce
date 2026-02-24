"use client";

import { ProductType } from "@/lib/type";
import ProductList from "../shared/ProductList";

interface Props {
  readonly storeName: string;
  readonly products: ProductType[];
}

export default function StoreProductsClient({ storeName, products }: Props) {
  return (
    <div className="relative mt-6">
      <ProductList
        products={products}
        title={`Recommended from ${storeName}`}
        arrow
      />
    </div>
  );
}
