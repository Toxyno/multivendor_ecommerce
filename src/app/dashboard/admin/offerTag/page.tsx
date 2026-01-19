import getAllOfferTags from "@/actions/OfferTag/getAllOfferTags";
import DataTable from "@/components/ui/datatable";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import OfferTagDetails from "@/components/dashboard/forms/OfferTagDetails";

const AdminOfferTagsPage = async () => {
  //Fetching offer tags data from the database
  const offerTags = await getAllOfferTags();

  //checking if no offer tags found
  if (!offerTags) {
    return null;
  }

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Offer Tag
        </>
      }
      modalChildren={<OfferTagDetails />}
      filterValue="name"
      searchPlaceholder="Search offer tag name..."
      columns={columns}
      data={offerTags}
      newTabLink="/dashboard/admin/offerTag/new"
    />
  );
};

export default AdminOfferTagsPage;
