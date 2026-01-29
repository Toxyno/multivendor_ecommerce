import Link from "next/link";
import UserMenu from "./userMenu/UserMenu";
import Cart from "./userMenu/Cart";
import DownloadApp from "./DownloadApp";
import Search from "./Search/search";
import { Country } from "@/lib/type";
import { cookies } from "next/headers";
import CountryLanguageCurrencySelector from "./CountryLanguageCurrencySelector/CountryLanguageCurrencySelector";

const StoreHeader = async () => {
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry")?.value;

  //Set the default country if the cookie is not found
  let userCountry: Country = {
    ip: "",
    asn: "",
    as_name: "United States",
    as_domain: "",
    country_code: "US",
    country_name: "United States",
    continent_code: "NA",
    continent: "North America",
  };

  //If cookie is found, parse the cookie value to get the country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie);
  }

  return (
    <div className="bg-linear-to-r from-slate-500 to-slate-800">
      <div className="h-full- w-full lg:flex text-white px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">GoShop</h1>
            </Link>
            <div className="flex lg:hidden">
              {/* Mobile menu button */}
              <UserMenu />
              <Cart />
            </div>
          </div>
          {/* Search Input */}
          <Search />
        </div>
        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
          <div className="lg:flex">
            <DownloadApp />
          </div>
          {/* Country Selecctor */}
          <CountryLanguageCurrencySelector userCountry={userCountry} />
          <UserMenu />
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
