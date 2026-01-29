import getAllCategory from "@/actions/categories/getAllCategory";
import getAllOfferTags from "@/actions/OfferTag/getAllOfferTags";
import CategoriesHeaderContainer from "./CategoriesHeaderContainer";

const categoriesHeader = async () => {
  //Fetch categories from store and display them as tabs
  const categories = await getAllCategory();

  //fetch offertags from store
  const offerTags = await getAllOfferTags();

  return (
    <div className="w-full pt-2 pb-3 px-0 bg-linear-to-r from-slate-500 to-slate-800 ">
      <CategoriesHeaderContainer
        categories={categories}
        offerTags={offerTags}
      />
    </div>
  );
};

export default categoriesHeader;
