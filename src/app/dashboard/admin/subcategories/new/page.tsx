import getAllCategory from "@/actions/categories/getAllCategory";
import SubCategoryDetails from "@/components/dashboard/forms/SubCategoryDetails";

const AdminNewSubCategoryPage = async () => {
  const categories = await getAllCategory();
  return <SubCategoryDetails categories={categories} />;
};

export default AdminNewSubCategoryPage;
