import { getStoreDefaultShippingDetails } from "@/actions/stores/getStoreDefaultShippingDetails";
import getStoreShippingRates from "@/actions/stores/getStoreShippingRates";
import StoreDefaultShippingDetails from "@/components/dashboard/forms/StoreDefaultShippingDetails";
import DataTable from "@/components/ui/datatable";
import { columns } from "./columns";

const SellerStoreShippingPage = async ({
  params,
}: {
  params: { storeUrl: string };
}) => {
  const { storeUrl } = await params;
  // call the store default function here
  const defaultShippingDetails = await getStoreDefaultShippingDetails(storeUrl);

  console.log("Default Shipping Details:", defaultShippingDetails);

  const shippingRates = await getStoreShippingRates(storeUrl);
  //console.log("Shipping Rates:", shippingRates);

  // ensure shape matches CountryWithShippingRateType (add required `ShippingRate` prop)
  const normalizedShippingRates = (shippingRates || []).map((c: any) => ({
    ...c,
    ShippingRate: c.shippingRates?.[0] ?? null,
  }));

  return (
    <div>
      <StoreDefaultShippingDetails
        data={defaultShippingDetails}
        storeURL={storeUrl}
      />
      <DataTable
        filterValue="countryName"
        data={normalizedShippingRates}
        columns={columns}
        searchPlaceholder="Search by country name..."
      />
    </div>
  );
};

export default SellerStoreShippingPage;
