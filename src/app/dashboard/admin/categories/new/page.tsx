import CategoryDetails from "@/components/dashboard/forms/CategoryDetails";

const AdminNewCategoryPage = () => {
  const CLOUDINARY_CLOUD_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  if (!CLOUDINARY_CLOUD_KEY) {
    throw new Error(
      "CLOUDINARY_CLOUD_KEY is not defined in environment variables"
    );
  }

  return (
    <div className="w-full">
      <CategoryDetails />
    </div>
  );
};

export default AdminNewCategoryPage;
