import CategoriesHeader from "@/components/store/layout/categoriesHeader/categoriesHeader";
import Footer from "@/components/store/layout/footer/Footer";

import StoreHeader from "@/components/store/layout/header/header";
import { ReactNode } from "react";
const StoreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <CategoriesHeader />

      <main className="flex-1 pb-24">{children}</main>

      {/* <div className="h-96  bg-red-600">SPACER</div> */}

      <Footer />
    </div>
  );
};

export default StoreLayout;
