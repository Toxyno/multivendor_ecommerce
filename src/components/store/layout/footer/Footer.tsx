import { getSubCategoriesByParams } from "@/actions/subcategories/getSubCategoriesByParams";
import Contact from "./Contact";
import Links from "./Links";
import NewsLetter from "./NewsLetter";

const footer = async () => {
  const subs = await getSubCategoriesByParams(7, true);
  return (
    <div className="w-full bg-white">
      <NewsLetter />
      {/* <div className="max-w-357.5 mx-auto"> */}
      <div className="p-5">
        <div className="grid md:grid-cols-2 md:gap-x-5">
          <Contact />
          <Links subcategories={subs} />
        </div>
      </div>
      {/* </div> */}
      {/* Rights */}
      <div className="bg-linear-to-r from-slate-500 to to-slate-800 px-2 text-white">
        <div className="max-w-7xl mx-auto py-4 text-center text-sm">
          © 2026 Shopsy. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default footer;
