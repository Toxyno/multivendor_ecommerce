import getAllCategory from "@/actions/categories/getAllCategory";
import CategoryDetails from "@/components/dashboard/forms/CategoryDetails";
import DataTable from "@/components/ui/datatable";
import { Plus } from "lucide-react";
import { columns } from "./columns";

const AdminCategoriesPage = async () => {
  //fethcing stores data from the database

  const categories = await getAllCategory();

  if (!categories) {
    return <div>No categories found.</div>;
  }

  // Ensure categories is always an array (wrap single object into an array)
  const categoriesArray = Array.isArray(categories) ? categories : [categories];

  // const CLOUDINARY_CLOUD_KEY =
  //   process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || "";

  // return <DataTable data={categories} filterValue="name" searchPlaceholder="Search categories..." columns={[]} />;
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={16} className="mr-2" />
          Create Category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categoriesArray}
      searchPlaceholder="Search categories..."
      columns={columns}
    />
  );
};

export default AdminCategoriesPage;
