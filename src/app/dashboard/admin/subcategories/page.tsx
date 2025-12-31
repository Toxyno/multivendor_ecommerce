import getAllSubCategories from "@/actions/subcategories/getAllSubCategory";
import SubCategoryDetails from "@/components/dashboard/forms/SubCategoryDetails";
import DataTable from "@/components/ui/datatable";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import getAllCategory from "@/actions/categories/getAllCategory";
const AdminSubCategoriesPage = async () => {
  //fetching subcategories from the database
  const subCategories = await getAllSubCategories();

  if (!subCategories) {
    return <div>No subcategories found.</div>;
  }

  //fetching categories from the database for the form select options
  const categories = await getAllCategory();

  // Ensure subcategories is always an array (wrap single object into an array)
  const subCategoriesArray = Array.isArray(subCategories)
    ? subCategories
    : [subCategories];

  // const CLOUDINARY_CLOUD_KEY =
  //   process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || "";

  // return <DataTable data={categories} filterValue="name" searchPlaceholder="Search categories..." columns={[]} />;
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} className="mr-2" />
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink="/dashboard/admin/subcategories/new"
      filterValue="name"
      data={subCategoriesArray}
      searchPlaceholder="Search subcategories..."
      columns={columns}
    />
  );
};

export default AdminSubCategoriesPage;
