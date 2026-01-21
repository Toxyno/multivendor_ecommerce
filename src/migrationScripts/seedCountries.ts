"use server";
import countries from "@/data/countries.json";
import { db } from "@/lib/db";

const seedCountries = async () => {
  try {
    for (const country of countries) {
      await db.country.upsert({
        where: { name: country.name },
        update: { name: country.name, code: country.code },
        create: { name: country.name, code: country.code },
      });
      console.log("Seeding country:", country.name);
    }
    console.log("Countries seeded successfully.");
  } catch (error) {
    console.error(error);
  }
};

export default seedCountries;
