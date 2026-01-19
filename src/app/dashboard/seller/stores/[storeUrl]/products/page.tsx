import { getAllStoreProducts } from "@/actions/products/getAllStoreStoreProducts";
import DataTable from "@/components/ui/datatable";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/forms/ProductDetails";
import getAllCategory from "@/actions/categories/getAllCategory";

type sellerproductpageparams = {
  params: {
    storeUrl: string;
  };
};

const SellerProductsPage = async ({ params }: sellerproductpageparams) => {
  const dparams = await params;
  console.log(`The storeUrl param is:`, dparams.storeUrl);
  //fethcing the product data from the database for the active store
  const products = await getAllStoreProducts(dparams.storeUrl);
  console.log("Fetched products for store:", products);
  const allCategories = await getAllCategory();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={16} className="mr-2" />
          Add Product
        </>
      }
      modalChildren={
        <ProductDetails
          categories={allCategories}
          storeUrl={dparams.storeUrl}
        />
      }
      newTabLink={`/dashboard/seller/stores/${dparams.storeUrl}/products/new`}
      filterValue="name"
      data={products}
      searchPlaceholder="Search product name..."
      columns={columns}
    />
  );
};

export default SellerProductsPage;
