import getAllCategory from "@/actions/categories/getAllCategory";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";
import { db } from "@/lib/db";
//import getAllOfferTags from "@/actions/OfferTag/getAllOfferTags";

type Props = {
  params: { storeUrl: string };
};

const SellerNewProductPage = async ({ params }: Props) => {
  const { storeUrl } = await params; // ✅ unwrap params
  const categories = await getAllCategory();
  //const offerTags = await getAllOfferTags();
  const countries = await db.country.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full">
      {/* <ProductDetails categories={categories} storeUrl={storeUrl} offerTags={offerTags} countries={countries} /> */}
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        countries={countries}
      />
    </div>
  );
};

export default SellerNewProductPage;
