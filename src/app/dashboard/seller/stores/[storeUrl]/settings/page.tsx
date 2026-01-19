import StoreDetails from "@/components/dashboard/forms/StoreDetails";
import { db } from "@/lib/db";

type SellerStoreSettingsPageProps = {
  params: Promise<{ storeUrl: string }>;
};

const SellerStoreSettingsPage = async ({
  params,
}: SellerStoreSettingsPageProps) => {
  const { storeUrl } = await params;

  // console.log("Store URL:", storeUrl);

  const storeDetails =
    (await db.store.findUnique({
      where: { url: storeUrl },
    })) ?? undefined;

  return <StoreDetails data={storeDetails} />;
};

export default SellerStoreSettingsPage;
