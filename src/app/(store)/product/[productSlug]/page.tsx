import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productSlug } = await params;

  // If slug is missing/invalid, redirect BEFORE Prisma
  if (!productSlug) redirect("/");

  // fetch product data using the productSlug from params
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      variants: true,
    },
  });

  if (!product || product.variants.length === 0) redirect("/");

  redirect(`/product/${product.slug}/${product.variants[0].slug}`);
};

export default ProductPage;
