import getAllCategory from "@/actions/categories/getAllCategory";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";

type Props = {
  params: { storeUrl: string };
};

const SellerNewProductPage = async ({ params }: Props) => {
  const { storeUrl } = await params; // ✅ unwrap params
  const categories = await getAllCategory();

  return (
    <div className="w-full">
      <ProductDetails categories={categories} storeUrl={storeUrl} />
    </div>
  );
};

export default SellerNewProductPage;
