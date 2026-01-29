"use client";
import "flag-icons/css/flag-icons.min.css";
import { ChevronDown } from "lucide-react";
import { Country, SelectMenuOption } from "@/lib/type";
import CountrySelector from "@/components/shared/countrySelector";
import { useState } from "react";
import countries from "@/data/countries.json";
import { useRouter } from "next/navigation";

const CountryLanguageCurrencySelector = ({
  userCountry,
}: {
  userCountry: Country;
}) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const handleCountryClick = async (countryName: string) => {
    console.log("Selected country:", countryName);
    //Find the countrydata from the countries list
    const selectedCountry = countries.find(
      (country) => country.name === countryName,
    );
    if (selectedCountry) {
      console.log("Selected country data:", selectedCountry);
      //update the cookies with the new selected country data
      const countryData: Country = {
        country: selectedCountry.name,
        country_code: selectedCountry.code,
        ip: "",
        asn: "",
        as_name: "",
        as_domain: "",
        continent: "",
        continent_code: "",
      };

      try {
        //Send a POST requuest Endpoint to the API endpoint to set the cookie
        //Because this is a Client componet, we cannot set the cookie here and that is the reason
        //we are calling the API endpoint to set the cookie from the server side
        const resp = await fetch("/api/setUserCountryInCookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userCountry: countryData }),
        });
        if (resp.ok) {
          router.refresh();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <div className="flex items-center h-11 py-0 px-2 cursor-pointer">
        <span className="mr-0.5 h-[33px] grid place-items-center">
          <span className={`fi fi-${userCountry.country_code.toLowerCase()}`} />
        </span>

        <div className="ml-1">
          <span className="block text-xs text-white leading-3 mt-2">
            {userCountry.country}/EN/
          </span>
          <b className="text-xs font-bold text-white">
            GBS{" "}
            <span className="text-white scale-[60%] align-middle inline-block">
              <ChevronDown />
            </span>
          </b>
        </div>
      </div>

      {/* Content */}
      <div className="hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 group-hover:block z-50">
        {/* Triangle (now ABOVE the box) */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0
                        border-l-[10px] border-l-transparent
                        border-r-[10px] border-r-transparent
                        border-b-[10px] border-b-white"
        />

        {/* Box */}
        <div className="w-[300px] bg-white rounded-[24px] text-black px-6 pt-4 pb-6 shadow-lg">
          <div className="leading-6 text-[20px] font-bold">Ship to</div>

          <div className="mt-3">
            <div className="relative text-black rounded-lg">
              <CountrySelector
                id="countries"
                open={show}
                onToggle={() => setShow((v) => !v)}
                onChange={(val) => handleCountryClick(val)}
                selectedValue={
                  (countries.find(
                    (country) => country.name === userCountry.country,
                  ) as SelectMenuOption) || (countries[0] as SelectMenuOption)
                }
              />

              <div>
                <div className="mt-4 leading-6 text-[20px] font-bold">
                  Language
                </div>
                <div className="relative mt-2.5 h-10 py-0 px-3 border-[1px] border-black rounded-lg flex items-center">
                  <div className="align-middle">English</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-black scale-75" />
                  </span>
                </div>
                <div className="mt-4 leading-6 text-[20px] font-bold">
                  Currency
                </div>
                <div className="relative mt-2.5 h-10 py-0 px-3 border-[1px] border-black rounded-lg flex items-center">
                  <div className="align-middle">GBP (£)</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-black scale-75" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryLanguageCurrencySelector;
