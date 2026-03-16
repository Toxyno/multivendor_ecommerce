"use client";

import ProductList from "@/components/store/shared/ProductList";
import useCartStore from "@/cartStore/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import type { ProductType } from "@/lib/type"; // adjust to your actual product type

type Props = {
  readonly products: ProductType[];
};

export default function HomeClient({ products }: Props) {
  const cart = useFromStore(useCartStore, (s) => s.cart, []);

  console.log("This is the cart from the store:", cart);

  return <ProductList products={products} title="All Products" arrow={true} />;
}
