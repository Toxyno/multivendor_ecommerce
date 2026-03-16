type SellerNewProductVariantPageProps = {
  params: {
    storeUrl: string;
    productId: string;
  };
};
import getAllCategory from "@/actions/categories/getAllCategory";
import { getProductMainInfo } from "@/actions/products/getProductMainInfo";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";
import { db } from "@/lib/db";

const SellerNewProductVariantPage = async ({
  params,
}: SellerNewProductVariantPageProps) => {
  const paramdetails = await params;
  console.log(`The paramdetails are:`, paramdetails);
  const categories = await getAllCategory();
  const productMainData = await getProductMainInfo(paramdetails.productId);
  console.log(
    `The paramdetails are:`,
    paramdetails.productId,
    ` and:`,
    paramdetails.storeUrl,
  );
  if (!productMainData) {
    throw new Error("Product not found");
  }
  const countries = await db.country.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <ProductDetails
        categories={categories}
        data={{
          ...productMainData,
          offerTagId: productMainData.offerTagId ?? undefined,
        }}
        storeUrl={paramdetails.storeUrl}
        countries={countries}
      />
    </div>
  );
};

export default SellerNewProductVariantPage;
