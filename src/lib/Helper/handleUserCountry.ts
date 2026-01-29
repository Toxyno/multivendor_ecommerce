import { Country } from "../type";
//import countries from "@/data/countries.json";
//Define the dafult Country
const DEFAULT_COUNTRY: Country = {
  ip: "8.8.8.8",
  asn: "",
  as_name: "United States",
  as_domain: "zscaler.com",
  country_code: "US",
  country: "United States",
  continent_code: "NA",
  continent: "North America",
};
const handleUserCountry = async (): Promise<Country> => {
  let userCountry: Country = DEFAULT_COUNTRY;

  try {
    //attempt to detect detect the country IP using the built-in Intl API
    const response = await fetch(
      `https://api.ipinfo.io/lite/me?token=${process.env.IP_INFO_TOKEN}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      const {
        ip,
        asn,
        as_name,
        as_domain,
        country_code,
        country,
        continent_code,
        continent,
      } = data;
      //   const countryName = countries.find(
      //     (country) => country.code === country_code,
      //   )?.name;
      //   console.log(`Detected country name: `, countryName);
      userCountry = {
        ip,
        asn,
        as_name,
        as_domain,
        country_code,
        country,
        continent_code,
        continent,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return userCountry;
};

export default handleUserCountry;
