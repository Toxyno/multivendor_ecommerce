type SellerNewProductVariantPageProps = {
  params: {
    storeUrl: string;
    productId: string;
  };
};
import getAllCategory from "@/actions/categories/getAllCategory";
import { getProductMainInfo } from "@/actions/products/getProductMainInfo";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";

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
    paramdetails.storeUrl
  );
  if (!productMainData) {
    throw new Error("Product not found");
  }

  return (
    <div>
      <ProductDetails
        categories={categories}
        data={productMainData}
        storeUrl={paramdetails.storeUrl}
      />
    </div>
  );
};

export default SellerNewProductVariantPage;
