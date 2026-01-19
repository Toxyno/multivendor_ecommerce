import { getAllStoreProducts } from "@/actions/products/getAllStoreStoreProducts";
import { Prisma } from "@/generated/prisma";

export type StoreProductType = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];
