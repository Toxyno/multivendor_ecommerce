import { getFilteredProducts } from "@/actions/products/getFilteredProducts";
import StoreProductsClient from "./StoreProducts.client";

interface Props {
  readonly storeUrl: string;
  readonly storeName: string;
  readonly count?: number;
}

export default async function StoreProductsServer({
  storeUrl,
  storeName,
  count,
}: Props) {
  const res = await getFilteredProducts(
    { store: storeUrl },
    "",
    1,
    count ?? 10,
  );

  return <StoreProductsClient storeName={storeName} products={res.products} />;
}
